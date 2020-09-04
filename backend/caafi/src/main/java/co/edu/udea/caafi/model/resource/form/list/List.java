package co.edu.udea.caafi.model.resource.form.list;

import co.edu.udea.caafi.model.resource.Resource;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class List extends Resource {
  private java.util.List<Object> listItems;
}
