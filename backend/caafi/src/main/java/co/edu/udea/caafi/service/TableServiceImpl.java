package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.resource.table.TableDto;
import co.edu.udea.caafi.model.resource.table.Table;
import co.edu.udea.caafi.utils.RoleUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio de gestión de Tablas de la aplicación
 */
@Service
public class TableServiceImpl implements TableService {

  private final ModelMapper modelMapper;

  private final MongoTemplate mongoTemplate;

  @Autowired
  public TableServiceImpl(ModelMapper modelMapper, MongoTemplate mongoTemplate) {
    this.modelMapper = modelMapper;
    this.mongoTemplate = mongoTemplate;
  }

  /**
   * Obtiene una tabla por el ID con las respectias validaciones de seguridad
   *
   * @param id ID de la tabla
   * @return opcional con la tabla encontrada
   */
  @Override
  public Optional<TableDto> findById(String id) {
    Optional<TableDto> tableDto = Optional.empty();
    Optional<Table> table = findEntityById(id);
    if(table.isPresent()) {
      // filtrar columnas por rol
      table.get().setColumns(
          table.get().getColumns().stream()
              .filter(tableColumn -> RoleUtils.isAuthorizedRoles(tableColumn.getRoles()))
              .collect(Collectors.toList())
      );
      // filtrar acciones por rol
      table.get().setActions(
          table.get().getActions().stream()
              .filter(tableAction -> RoleUtils.isAuthorizedRoles(tableAction.getRoles()))
              .collect(Collectors.toList())
      );
      tableDto = Optional.of(modelMapper.map(table.get(), TableDto.class));
    }
    return tableDto;
  }

  @Override
  public MongoTemplate getMongoTemplate() {
    return mongoTemplate;
  }

  @Override
  public ModelMapper getModelMapper() {
    return modelMapper;
  }

  @Override
  public Class<Table> getEntityClass() {
    return Table.class;
  }

  @Override
  public Class<TableDto> getEntityDtoClass() {
    return TableDto.class;
  }
}
