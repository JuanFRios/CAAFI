package co.edu.udea.caafi.model.facultad;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Entidad para la gestión de facultades
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Document(collection = "facultad")
public class Facultad {

  /** Identificador único de la facultad */
  @Id
  private String id;

  /** Nombre de la facultad */
  private String nombre;

  /** Descripción de la facultad */
  private String descripcion;
}
