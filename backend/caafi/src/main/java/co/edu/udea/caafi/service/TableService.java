package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.resource.table.TableDto;
import co.edu.udea.caafi.model.resource.table.Table;

import java.util.Optional;

/**
 * Servicio de gestión de Tablas de la aplicación
 */
public interface TableService extends ResourceService<Table, TableDto> {

  /**
   * Obtiene una tabla por el ID con las respectias validaciones de seguridad
   *
   * @param id ID de la tabla
   * @return opcional con la tabla encontrada
   */
  Optional<TableDto> findById(String id);
}
