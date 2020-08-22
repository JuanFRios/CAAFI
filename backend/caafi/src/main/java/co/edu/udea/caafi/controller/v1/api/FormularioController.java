package co.edu.udea.caafi.controller.v1.api;

import co.edu.udea.caafi.dto.template.formulario.FormularioDto;
import co.edu.udea.caafi.service.FormularioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de formularios
 */
@RestController
@RequestMapping("/formularios")
public class FormularioController {

  private final FormularioService formularioService;

  @Autowired
  public FormularioController(FormularioService formularioService) {
    this.formularioService = formularioService;
  }

  @GetMapping("/{id}")
  public FormularioDto findById(@PathVariable("id") String id) {
    return formularioService.findById(id);
  }
}
