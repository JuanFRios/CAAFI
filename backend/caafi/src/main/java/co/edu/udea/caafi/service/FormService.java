package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.resource.form.FormDto;
import co.edu.udea.caafi.dto.resource.form.list.ListDto;
import co.edu.udea.caafi.model.resource.form.Form;

import java.util.Optional;

public interface FormService extends ResourceService<Form, FormDto> {

  Optional<ListDto> findListById(String id);
}