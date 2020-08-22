package co.edu.udea.caafi.dto.facultad;

import co.edu.udea.caafi.dto.template.TemplateDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

import java.util.List;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@ToString
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UnidadDto {
  private String id;
  private String nombre;
  private String descripcion;
  private DependenciaDto dependencia;
  private List<TemplateDto> templates;
}
