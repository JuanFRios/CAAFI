package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.template.TemplateDto;
import co.edu.udea.caafi.model.template.Template;
import co.edu.udea.caafi.repository.TemplateRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TemplateServiceImpl implements TemplateService {

  private final ModelMapper modelMapper;

  private final TemplateRepository templateRepository;

  @Autowired
  public TemplateServiceImpl(ModelMapper modelMapper, TemplateRepository templateRepository) {
    this.modelMapper = modelMapper;
    this.templateRepository = templateRepository;
  }

  @Override
  public Optional<TemplateDto> findById(String id) {
    return templateRepository.findById(id).map(template -> modelMapper.map(template, TemplateDto.class));
  }
}
