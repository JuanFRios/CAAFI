package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.resource.form.FormDto;
import co.edu.udea.caafi.dto.resource.form.list.ListDto;
import co.edu.udea.caafi.model.resource.form.Form;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FormServiceImpl implements FormService {

  private final ModelMapper modelMapper;

  private final MongoTemplate mongoTemplate;

  private final ListService listService;

  @Autowired
  public FormServiceImpl(ModelMapper modelMapper, MongoTemplate mongoTemplate, ListService listService) {
    this.modelMapper = modelMapper;
    this.mongoTemplate = mongoTemplate;
    this.listService = listService;
  }

  @Override
  public Optional<ListDto> findListById(String id) {
    return listService.findById(id);
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
  public Class<Form> getEntityClass() {
    return Form.class;
  }

  @Override
  public Class<FormDto> getEntityDtoClass() {
    return FormDto.class;
  }
}
