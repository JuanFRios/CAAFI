package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.template.DataDto;
import co.edu.udea.caafi.model.template.Data;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.repository.support.PageableExecutionUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DataServiceImpl implements DataService {

  private final ModelMapper modelMapper;

  private final MongoTemplate mongoTemplate;

  @Autowired
  public DataServiceImpl(ModelMapper modelMapper, MongoTemplate mongoTemplate) {
    this.modelMapper = modelMapper;
    this.mongoTemplate = mongoTemplate;
  }

  /**
   * Obtiene todos los elementos de la entidad desde la base de datos con paginación (número página, tamaño página,
   * ordenamiento), un filtro de texto o palabra clave y los campos que se filtraran por palabra clave
   *
   * @param filter filtro de texto o palabra clave
   * @param filterFields campos para el filtrado
   * @param pageable paginación (número página, tamaño página, ordenamiento)
   * @return página con los datos de la entidad
   */
  @Override
  public Page<DataDto> findAll(String filter, List<String> filterFields, Pageable pageable, String unidadId,
                               String templateId, String collectionName) {
    Query query = new Query()
        .addCriteria(
          new Criteria().orOperator(
              filterFields.stream()
                  .map(filterField -> Criteria.where("data." + filterField).regex(filter, "i"))
                  .toArray(Criteria[]::new)
          )
        ).addCriteria(
            Criteria
                .where("unidad.$id").is(new ObjectId(unidadId))
                .and("template.$id").is(new ObjectId(templateId))
        ).with(pageable);
    List<DataDto> listDto = mongoTemplate.find(query, DataDto.class, collectionName);
    return PageableExecutionUtils.getPage(
        listDto,
        pageable,
        () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Data.class, collectionName)
    );
  }

  /**
   * Guarda una nueva entidad en base de datos
   *
   * @param dataDto DTO de la entidad a guardar
   * @return DTO de la entidad guardada
   */
  @Override
  public Optional<DataDto> save(DataDto dataDto, String collectionName) {
    Data data = modelMapper.map(dataDto, Data.class);
    Data savedData = mongoTemplate.save(data, collectionName);
    return Optional.of(modelMapper.map(savedData, DataDto.class));
  }

  /**
   * Obtiene un DTO de la entidad por su identificador
   *
   * @param id identificador
   * @return DTO de la entidad si existe en otro caso vacio
   */
  @Override
  public Optional<DataDto> findById(String id, String collectionName) {
    return Optional.ofNullable(mongoTemplate.findById(id, DataDto.class, collectionName));
  }

  /**
   * Actualiza una entidad en la base de datos si esta existe
   *
   * @param id identificador de la entidad
   * @param dataDto DTO con los datos a guardar
   * @return DTO de la entidad guardada si existe de lo contrario retorna vacio
   */
  @Override
  public Optional<DataDto> update(String id, DataDto dataDto, String collectionName) {
    Data entity = mongoTemplate.findById(id, Data.class, collectionName);
    if (entity != null) {
      entity.setData(dataDto.getData());
      return Optional.of(modelMapper.map(mongoTemplate.save(entity, collectionName), DataDto.class));
    }
    return Optional.empty();
  }

  /**
   * Elimina un documento de base de datos por id
   *
   * @param id identificador del documento
   * @return cantidad de documentos eliminados
   */
  @Override
  public long delete(String id, String collectionName) {
    Data data = mongoTemplate.findById(id, Data.class, collectionName);
    if (data != null) {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      data.setDeletedBy(authentication.getName());
      data.setDeletedDate(LocalDateTime.now());
      mongoTemplate.save(data, "deleteddata");
      return mongoTemplate.remove(data, collectionName).getDeletedCount();
    }
    return 0;
  }
}
