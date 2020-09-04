package co.edu.udea.caafi.dto.resource.table;

import co.edu.udea.caafi.dto.resource.ResourceDto;
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
public class TableDto extends ResourceDto {
  private String title;
  private List<TableColumnDto> columns;
  private List<TableActionDto> actions;
}
