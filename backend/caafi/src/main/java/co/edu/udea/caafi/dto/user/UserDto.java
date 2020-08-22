package co.edu.udea.caafi.dto.user;

import co.edu.udea.caafi.dto.facultad.DependenciaDto;
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
public class UserDto {
  private String id;
  private String username;
  private String identificacion;
  private String nombre;
  private String email;
  private List<RoleDto> roles;
  private List<DependenciaDto> dependencias;
  private String token;
}
