package co.edu.udea.caafi.model.template;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Clase entidad de plantillas o templates
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Document(collection = "template")
public class Template {

  /** Identificador de la plantilla */
  @Id
  private String id;

  /** Nombre de la plantilla */
  private String nombre;

  /** Descripción de la plantilla */
  private String descripcion;
}
