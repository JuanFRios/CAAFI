package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.template.formulario.FormularioDto;

/**
 * Servicio para la gestión de formularios
 */
public interface FormularioService {

  /**
   * Obtiene un formulario a partir del id
   *
   * @param id identificador del dormulario
   * @return DTO del formulario
   */
  FormularioDto findById(String id);
}
