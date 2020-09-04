package co.edu.udea.caafi.controller.v1.api;

import co.edu.udea.caafi.dto.resource.ResourceDto;
import co.edu.udea.caafi.service.ResourceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Controlador de recursos de la aplicación
 *
 * @param <D> Tipo del Dto del recurso
 */
public abstract class ResourceController<D extends ResourceDto> {

  /**
   * Obtiene el recurso por el ID
   *
   * @param id ID del recurso
   * @return respuesta con recurso encontrado
   */
  @GetMapping("/{id}")
  public D findById(@PathVariable("id") String id) {
    return getService().findById(id).orElse(null);
  }

  /**
   * Obtiene el servicio de la clase
   *
   * @return Servicio
   */
  public abstract ResourceService<?, D> getService();
}
