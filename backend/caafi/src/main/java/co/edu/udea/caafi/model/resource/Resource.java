package co.edu.udea.caafi.model.resource;

import co.edu.udea.caafi.model.user.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Entidad para la gestión de los recurso de la aplicación, menús, listas, formularios, etc...
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Document(collection = "resource")
public class Resource {

  /** Identificador */
  @Id
  private String id;

  /** nombre del recurso */
  private String name;

  /** descripcion del recurso */
  private String description;

  /** Lista de roles que tiene permiso para consultar el recurso */
  @DBRef
  private List<Role> roles;
}
