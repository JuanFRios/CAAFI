package co.edu.udea.caafi.model.resource.table;

import co.edu.udea.caafi.model.user.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class TableColumn {
  private String key;
  private String header;
  private String type;
  private boolean visible;
  private String objectField;
  private boolean filter;
  private String trueValue;
  private String falseValue;
  @DBRef
  private List<Role> roles;
}
