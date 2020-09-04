package co.edu.udea.caafi.controller.v1.api;

import co.edu.udea.caafi.controller.v1.request.LoginRequest;
import co.edu.udea.caafi.controller.v1.request.TokenResponse;
import co.edu.udea.caafi.dto.user.UserDto;
import co.edu.udea.caafi.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;

import javax.validation.Valid;
import java.util.Optional;

/**
 * Controlador para la gestión de usuarios de la aplicación
 */
@RestController
@RequestMapping("/users")
public class UserController {

  private final UserService userService;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  /**
   * Servicio con el que inicai la sesión un usuario genera un token de acceso
   *
   * @param loginRequest request de la petición
   * @return datos de acceso
   */
  @PostMapping("/signin")
  public UserDto login(@RequestBody @Valid LoginRequest loginRequest) {
    Optional<UserDto> userDto = userService.signin(loginRequest.getUsername(), loginRequest.getPassword());
    if (userDto.isPresent()) {
      return userDto.get();
    }
    throw new HttpServerErrorException(HttpStatus.FORBIDDEN, "Login Failed");
  }

  @PostMapping("/refresh-jwt")
  public TokenResponse refreshJWT(@RequestBody String token) {
    return new TokenResponse().setToken(userService.refreshJWT(token));
  }

}
