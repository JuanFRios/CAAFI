package co.edu.udea.caafi.config.auditing;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Configuración de la auditoría de la aplicación
 */
@Component
public class UserAudtiting implements AuditorAware<String> {

  /**
   * Obtiene el auditor actual a partir de la autenticación actual
   *
   * @return auditor actual
   */
  @Override
  public Optional<String> getCurrentAuditor() {
    Optional<String> currentAuditor = Optional.empty();
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (!(authentication instanceof AnonymousAuthenticationToken)) {
      currentAuditor = Optional.of(authentication.getName());
    }
    return currentAuditor;
  }
}
