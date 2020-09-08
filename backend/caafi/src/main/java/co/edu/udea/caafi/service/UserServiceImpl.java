package co.edu.udea.caafi.service;

import co.edu.udea.caafi.config.security.JwtProvider;
import co.edu.udea.caafi.dto.facultad.DependenciaDto;
import co.edu.udea.caafi.dto.user.RoleDto;
import co.edu.udea.caafi.dto.user.UserDto;
import co.edu.udea.caafi.model.user.User;
import co.edu.udea.caafi.model.user.sipe.DependenciaSIPE;
import co.edu.udea.caafi.repository.UserRepository;
import co.edu.udea.exception.OrgSistemasSecurityException;
import co.edu.udea.wsClient.OrgSistemasWebServiceClient;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

  @Value("${udea.security.publickey}")
  private String publicKey;

  @Value("${udea.security.token}")
  private String token;

  @Value("${udea.sipe.validarusuario}")
  private String servicioValidarUsuario;

  @Value("${udea.sipe.dependencias}")
  private String servicioDependencias;

  @Autowired
  private AuthenticationManager authenticationManager;

  private final ModelMapper modelMapper;

  private final JwtProvider jwtProvider;

  private final UserRepository userRepository;

  @Autowired
  public UserServiceImpl(ModelMapper modelMapper, JwtProvider jwtProvider, UserRepository userRepository) {
    this.modelMapper = modelMapper;
    this.jwtProvider = jwtProvider;
    this.userRepository = userRepository;
  }

  /**
   * Inicia la sesión de un usuario
   *
   * @param username nombre de usuario
   * @param password contraseña
   * @return usuario logueado
   */
  @Override
  public Optional<UserDto> signin(String username, String password) {

    // Cargar usuario de SIPE
    UserDto userDto = getUserSIPE(username, password);

    // Carga usuario de DB
    Optional<User> userDB = userRepository.findByUsername(username);
    if (userDB.isPresent()) {
      try {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        UserDto userDBDto = modelMapper.map(userDB.get(), UserDto.class);

        // Si el usuario no esta en sipe pero esta en base de datos
        if (userDto == null) {
          userDto = userDBDto;
        } else { // Se unifican los usuarios y prevalece el usuario de base de datos
          modelMapper.map(userDBDto, userDto);
        }
      } catch (AuthenticationException e){
        log.info("Log in failed for user {}", username);
      }
    }

    if (userDto != null) {
      userDto.setToken(jwtProvider.createTokenFromDto(username, userDto.getRoles()));
      return Optional.of(userDto);
    }
    return Optional.empty();
  }

  /**
   * Obtiene el usuario de SIPE
   *
   * @param username nombre de usuario
   * @param password contraseña
   * @return usuario
   */
  private UserDto getUserSIPE(String username, String password) {
    String doc;
    UserDto user = null;
    OrgSistemasWebServiceClient wsClient;

    try {
      wsClient = new OrgSistemasWebServiceClient(publicKey);
      wsClient.addParam("usuario", username);
      wsClient.addParam("clave", password);
      doc = wsClient.obtenerString(servicioValidarUsuario, token).trim();

      if ("".equals(doc) || doc.contains("ERROR")) {
        return null;
      }

      user = new UserDto();
      user.setUsername(username);
      user.setIdentificacion(doc);
      user.setDependencias(getDependenciasUsuario(doc)
          .stream()
          .map(dependencia -> new DependenciaDto().setCodigo(dependencia.getCodigoDependencia()))
          .collect(Collectors.toList()));
      user.setRoles(user.getDependencias()
          .stream()
          .flatMap(dependencia -> dependencia.getRoles().stream())
          .map(role -> new RoleDto().setCodigo(role.getCodigo()))
          .distinct()
          .collect(Collectors.toList())
      );

    } catch (OrgSistemasSecurityException | Exception ex) {
      log.error("getUser OrgSistemasWebServiceClient exception, error: " + ex.getMessage());
    }

    return user;
  }

  /**
   * Obtiene la lista de dependencias a las que pertenece el usuario por idnetificación
   *
   * @param identificacion identificación del usuario
   * @return lista de dependencias
   */
  private List<DependenciaSIPE> getDependenciasUsuario(String identificacion) {
    List<DependenciaSIPE> listaDependencias = new ArrayList<>();
    try {
      OrgSistemasWebServiceClient wsClient = new OrgSistemasWebServiceClient();
      wsClient.addParam("cedula", identificacion);
      listaDependencias = wsClient.obtenerBean(servicioDependencias, token, DependenciaSIPE.class);
    } catch (OrgSistemasSecurityException | Exception ex) {
      log.error("getUser OrgSistemasWebServiceClient setUserDependency exception, error: " + ex.getMessage());
    }
    return listaDependencias;
  }

  /**
   * Genera un nuevo token a partir de uno vigente
   *
   * @param token token vigente
   * @return nuevo token
   */
  @Override
  public String refreshJWT(String token) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Optional<User> user = userRepository.findByUsername(authentication.getName());
    return user.map(value -> jwtProvider.createToken(value.getUsername(), value.getRoles())).orElse(null);
  }

  /**
   * Obtiene un usario por el username
   *
   * @param username nombre de usuario
   * @return usuario encontrado
   */
  @Override
  public Optional<UserDto> findByUsername(String username) {
    return userRepository.findByUsername(username).map(user -> modelMapper.map(user, UserDto.class));
  }

}
