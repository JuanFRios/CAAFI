package co.edu.udea.caafi.controller.v1.api;

import co.edu.udea.caafi.dto.resource.table.TableDto;
import co.edu.udea.caafi.service.ResourceService;
import co.edu.udea.caafi.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para la gestión de tablas de la aplicación
 */
@RestController
@RequestMapping("/tables")
public class TableController extends ResourceController<TableDto> {

  private final TableService tableService;

  @Autowired
  public TableController(TableService tableService) {
    this.tableService = tableService;
  }

  @Override
  public ResourceService<?, TableDto> getService() {
    return tableService;
  }
}
