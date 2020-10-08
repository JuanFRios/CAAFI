package co.edu.udea.caafi.dto.template;

import co.edu.udea.caafi.dto.facultad.DependenciaDto;
import co.edu.udea.caafi.dto.facultad.UnidadDto;
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
public class DataArtuculoDto {
  private String id;
  private Object data;
  private String templateId;
  private TemplateDto template;
  private String unidadId;
  private UnidadDto unidad;
}
