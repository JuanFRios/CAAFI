package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.resource.form.list.ListDto;
import co.edu.udea.caafi.model.resource.form.list.List;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class ListServiceImpl implements ListService {

  private final MongoTemplate mongoTemplate;

  private final ModelMapper modelMapper;

  @Autowired
  public ListServiceImpl(MongoTemplate mongoTemplate, ModelMapper modelMapper) {
    this.mongoTemplate = mongoTemplate;
    this.modelMapper = modelMapper;
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
  public Class<List> getEntityClass() {
    return List.class;
  }

  @Override
  public Class<ListDto> getEntityDtoClass() {
    return ListDto.class;
  }
}
