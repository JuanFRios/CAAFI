package co.edu.udea.caafi.model.template.formulario;

import co.edu.udea.caafi.model.resource.Resource;
import co.edu.udea.caafi.model.template.Template;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.mongodb.core.mapping.DBRef;

/**
 * Clase entidad de formularios
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class Formulario extends Template {

  @DBRef
  private Resource tabla;

  @DBRef
  private Resource formulario;
}
