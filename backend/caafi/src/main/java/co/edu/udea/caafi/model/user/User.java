package co.edu.udea.caafi.model.user;

import co.edu.udea.caafi.model.facultad.Dependencia;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Clase para la gestión de usuarios de la aplicación
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Document(collection = "user")
public class User {

  /** Identificador */
  @Id
  private String id;

  /** Nombre de usuario */
  @Indexed(unique= true)
  private String username;

  /** Contraseña */
  private String password;

  /** Número de identificación del usuario */
  private String identificacion;

  /** Nombre propio del usuario */
  private String nombre;

  /** Correo electrónico */
  private String email;

  /** Roles del usuario */
  @DBRef
  private List<Role> roles;

  /** Dependencias a las que pertenece el usuario */
  @DBRef
  private List<Dependencia> dependencias;
}
