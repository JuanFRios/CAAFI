package co.edu.udea.caafi.model.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;

/**
 * Entidad para la gestión de roles de usuarios en la aplicación
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Document(collection = "role")
public class Role implements GrantedAuthority {

  /** Código del rol */
  @Id
  private String codigo;

  /** Descripción del rol */
  private String descripcion;

  @Override
  public String getAuthority() {
    return codigo;
  }
}
