package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.template.TemplateDto;

import java.util.Optional;

public interface TemplateService {

  Optional<TemplateDto> findById(String id);
}
