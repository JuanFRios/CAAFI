package co.edu.udea.caafi.model.facultad;

import co.edu.udea.caafi.model.template.Template;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Clase para la gestión de unidades de las dependencias
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Document(collection = "unidad")
public class Unidad {

  /** Identificador de la unidad */
  @Id
  private String id;

  /** nombre de la unidad */
  private String nombre;

  /** descripción de la unidad */
  private String descripcion;

  /** dependencia a la que pertenece la unidad */
  private Dependencia dependencia;

  /** lista de templates de la unidad */
  private List<Template> templates;
}
