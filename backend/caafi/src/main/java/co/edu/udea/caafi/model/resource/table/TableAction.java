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
public class TableAction {
  private String key;
  private String tooltip;
  private String visibility;
  private String function;
  private String icon;
  @DBRef
  private List<Role> roles;
}
