package co.edu.udea.caafi.model.facultad;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Clase para la gestión de dependencias de las facultades
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Document(collection = "dependencia")
public class Dependencia {

  /** Código de la dependencia este es el mismo código que se ibtiene de SIPE */
  @Id
  private String codigo;

  /** Nombre de la dependnecia */
  private String nombre;

  /** Descripción de la dependencia */
  private String descripcion;

  /** Facultad a la que pertenece la dependencia */
  @DBRef
  private Facultad facultad;
}
