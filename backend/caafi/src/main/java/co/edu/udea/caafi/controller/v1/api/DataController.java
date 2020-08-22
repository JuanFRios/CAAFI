package co.edu.udea.caafi.controller.v1.api;

import co.edu.udea.caafi.controller.v1.request.DataRequest;
import co.edu.udea.caafi.dto.facultad.DependenciaDto;
import co.edu.udea.caafi.dto.template.DataDto;
import co.edu.udea.caafi.dto.template.TemplateDto;
import co.edu.udea.caafi.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/data")
public class DataController {

  private final DataService dataService;

  @Autowired
  public DataController(DataService dataService) {
    this.dataService = dataService;
  }

  /**
   * Obtiene todos los datos
   *
   * @param filter palabras clave para la busqueda
   * @param filterFields campos para realizar la busqueda
   * @param pageable página de inicio, tamaño de página y ordenamiento
   * @return respuesta con página de usuarios encontradas
   */
  @GetMapping
  public Page<DataDto> findAll(@RequestParam String filter, @RequestParam String[] filterFields, Pageable pageable,
                               DataRequest template) {
    return dataService.findAll(filter, Arrays.asList(filterFields), pageable, template.getTemplate(), template.getDependencia());
  }

  /**
   * Guarda un dato
   *
   * @param dataRequest request con los datos
   * @return response con el dato guardado
   */
  @PostMapping
  public DataDto save(@RequestBody DataRequest dataRequest) {
    DataDto dataDto = new DataDto()
        .setData(dataRequest.getData())
        .setDependencia(new DependenciaDto().setCodigo(dataRequest.getDependencia()))
        .setTemplate(new TemplateDto().setId(dataRequest.getTemplate()));
    return dataService.save(dataDto).orElse(null);
  }

  /**
   * Obtiene un dato por id
   *
   * @param id id del dato
   * @return response con el dato si existe en otro caso retorna not found
   */
  @GetMapping("/{id}")
  public DataDto findById(@PathVariable("id") String id, DataRequest template) {
    return dataService.findById(id, template.getTemplate()).orElse(null);
  }

  /**
   * Actualiza un dato
   *
   * @param id id del dato a actualizar
   * @param updateDataRequest request con los datos a actualizar
   * @return response con ok si el dato fue actualizado y existe de lo contrario devuelve not found
   */
  @PutMapping("/{id}")
  public DataDto update(@PathVariable("id") String id, @RequestBody DataRequest updateDataRequest) {
    DataDto dataDto = new DataDto()
        .setData(updateDataRequest.getData())
        .setDependencia(new DependenciaDto().setCodigo(updateDataRequest.getDependencia()))
        .setTemplate(new TemplateDto().setId(updateDataRequest.getTemplate()));
    return dataService.update(id, dataDto).orElse(null);
  }

  /**
   * Elimina un dato por id
   *
   * @param id id del dato
   * @return response con ok si se elimina el dato satisfactoriamente
   */
  @DeleteMapping("/{id}")
  public boolean delete(@PathVariable("id") String id, DataRequest template) {
    return dataService.delete(id, template.getTemplate()) > 0;
  }
}
