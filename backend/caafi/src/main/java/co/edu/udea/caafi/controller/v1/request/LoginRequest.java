package co.edu.udea.caafi.controller.v1.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginRequest {
  @NotBlank(message = "{constraints.notblank}")
  @Size(max=254, message="{constraints.maxsize}")
  private String username;
  @NotBlank(message = "{constraints.notblank}")
  @Size(max=254, message="{constraints.maxsize}")
  private String password;
}
