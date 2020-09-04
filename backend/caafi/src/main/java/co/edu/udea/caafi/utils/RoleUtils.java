package co.edu.udea.caafi.utils;

import co.edu.udea.caafi.model.user.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Clase de utilidades para el manejo de roles
 */
public class RoleUtils {

  /**
   * Devuelve si algún rol de la lista de roles pasada como parametro pertenece al usuario logueado
   *
   * @param roles lista de roles
   * @return verdadero si el usuario contiene alguno de los roles o falso en caso contrario
   */
  public static boolean isAuthorizedRoles(List<Role> roles) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return roles == null || roles.isEmpty() || roles.stream()
        .map(Role::getAuthority)
        .anyMatch(
            authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList())
                ::contains
        );
  }
}
