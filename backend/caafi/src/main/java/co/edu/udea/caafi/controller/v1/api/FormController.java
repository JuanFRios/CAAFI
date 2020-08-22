package co.edu.udea.caafi.controller.v1.api;

import co.edu.udea.caafi.dto.resource.form.FormDto;
import co.edu.udea.caafi.service.FormService;
import co.edu.udea.caafi.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para la gestión de formularios de la aplicación
 */
@RestController
@RequestMapping("/forms")
public class FormController extends ResourceController<FormDto> {

  private final FormService formService;

  @Autowired
  public FormController(FormService formService) {
    this.formService = formService;
  }

  @Override
  public ResourceService<?, FormDto> getService() {
    return formService;
  }
}
