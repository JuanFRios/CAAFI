package co.edu.udea.caafi.dto.template.formulario;

import co.edu.udea.caafi.dto.resource.ResourceDto;
import co.edu.udea.caafi.dto.template.TemplateDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@ToString
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class FormularioDto extends TemplateDto {
  private ResourceDto tabla;
  private ResourceDto formulario;
}
