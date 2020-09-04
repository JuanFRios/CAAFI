package co.edu.udea.caafi.config.security;

import co.edu.udea.caafi.model.user.User;
import co.edu.udea.caafi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

import static org.springframework.security.core.userdetails.User.withUsername;

/**
 * Servicio de detalles de usuario
 */
@Component
public class CaafiUserDetailsService implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private JwtProvider jwtProvider;

  /**
   * Carga un usuario a partir de el username
   *
   * @param username nombre de uasurio
   * @return detalles del usuario
   */
  @Override
  public UserDetails loadUserByUsername(String username) {
    // Consulta el usuario en la DB
    User user = userRepository.findByUsername(username).orElseThrow(() ->
        new UsernameNotFoundException(String.format("El usuario con nombre %s no existe", username)));

    return withUsername(user.getUsername())
        .password(user.getPassword())
        .authorities(user.getRoles())
        .accountExpired(false)
        .accountLocked(false)
        .credentialsExpired(false)
        .disabled(false)
        .build();
  }

  /**
   * Extract username and roles from a validated jwt string.
   *
   * @param jwtToken jwt string
   * @return UserDetails if valid, Empty otherwise
   */
  public Optional<UserDetails> loadUserByJwtToken(String jwtToken) {
    if (jwtProvider.isValidToken(jwtToken)) {
      return Optional.of(
          withUsername(jwtProvider.getUsername(jwtToken))
              .authorities(jwtProvider.getRoles(jwtToken))
              .password("") //token does not have password but field may not be empty
              .accountExpired(false)
              .accountLocked(false)
              .credentialsExpired(false)
              .disabled(false)
              .build());
    }
    return Optional.empty();
  }
}
