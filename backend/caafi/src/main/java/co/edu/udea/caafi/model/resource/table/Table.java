package co.edu.udea.caafi.model.resource.table;

import co.edu.udea.caafi.model.resource.Resource;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class Table extends Resource {
  private String title;
  private List<TableColumn> columns;
  private List<TableAction> actions;
}
