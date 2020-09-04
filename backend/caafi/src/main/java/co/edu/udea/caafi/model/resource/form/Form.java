package co.edu.udea.caafi.model.resource.form;

import co.edu.udea.caafi.model.resource.Resource;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class Form extends Resource {

  private String title;

  private Object fields;
}
