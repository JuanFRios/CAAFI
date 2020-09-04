package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.user.UserDto;

import java.util.Optional;

public interface UserService {

  /**
   * Sign in a user into the application, with JWT-enabled authentication
   *
   * @param username  username
   * @param password  password
   * @return Optional of the Java Web Token, empty otherwise
   */
  Optional<UserDto> signin(String username, String password);

  /**
   * Genera un nuevo token a partir de uno vigente
   *
   * @param token token vigente
   * @return nuevo token
   */
  String refreshJWT(String token);

  /**
   * Obtiene un usario por el username
   *
   * @param username nombre de usuario
   * @return usuario encontrado
   */
  Optional<UserDto> findByUsername(String username);
}
