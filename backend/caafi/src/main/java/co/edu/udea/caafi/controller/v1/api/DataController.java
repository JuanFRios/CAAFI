package co.edu.udea.caafi.controller.v1.api;

import co.edu.udea.caafi.dto.facultad.UnidadDto;
import co.edu.udea.caafi.dto.template.DataDto;
import co.edu.udea.caafi.dto.template.TemplateDto;
import co.edu.udea.caafi.service.DataService;
import co.edu.udea.caafi.service.TemplateService;
import co.edu.udea.caafi.service.UnidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("/data")
public class DataController {

  private final DataService dataService;

  private final TemplateService templateService;

  private final UnidadService unidadService;

  @Autowired
  public DataController(DataService dataService, TemplateService templateService, UnidadService unidadService) {
    this.dataService = dataService;
    this.templateService = templateService;
    this.unidadService = unidadService;
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
  public Page<DataDto> findAll(@RequestParam String filter, @RequestParam String[] filterFields,
                               Pageable pageable, @RequestParam String unidadId, @RequestParam String templateId) {
    Optional<TemplateDto> template = templateService.findById(templateId);
    if (template.isEmpty()) {
      return Page.empty();
    }
    return dataService.findAll(filter, Arrays.asList(filterFields), pageable, unidadId, templateId,
        template.get().getDataCollectionName());
  }

  /**
   * Guarda un dato
   *
   * @param data request con los datos
   * @return response con el dato guardado
   */
  @PostMapping
  public DataDto save(@RequestBody DataDto data) {
    Optional<TemplateDto> template = templateService.findById(data.getTemplateId());
    if (template.isEmpty()) {
      return null;
    }
    Optional<UnidadDto> unidad = unidadService.findById(data.getUnidadId());
    if (unidad.isEmpty()) {
      return null;
    }
    data.setUnidad(unidad.get());
    data.setTemplate(template.get());
    return dataService.save(data, template.get().getDataCollectionName()).orElse(null);
  }

  /**
   * Obtiene un dato por id
   *
   * @param id id del dato
   * @return response con el dato si existe en otro caso retorna not found
   */
  @GetMapping("/{id}")
  public DataDto findById(@PathVariable("id") String id, @RequestParam String templateId) {
    Optional<TemplateDto> template = templateService.findById(templateId);
    if (template.isEmpty()) {
      return null;
    }
    return dataService.findById(id, template.get().getDataCollectionName()).orElse(null);
  }

  /**
   * Actualiza un dato
   *
   * @param id id del dato a actualizar
   * @param updateDataRequest request con los datos a actualizar
   * @return response con ok si el dato fue actualizado y existe de lo contrario devuelve not found
   */
  @PutMapping("/{id}")
  public DataDto update(@PathVariable("id") String id, @RequestBody DataDto updateDataRequest) {
    Optional<TemplateDto> template = templateService.findById(updateDataRequest.getTemplateId());
    if (template.isEmpty()) {
      return null;
    }
    return dataService.update(id, updateDataRequest, template.get().getDataCollectionName()).orElse(null);
  }

  /**
   * Elimina un dato por id
   *
   * @param id id del dato
   * @return response con ok si se elimina el dato satisfactoriamente
   */
  @DeleteMapping("/{id}")
  public boolean delete(@PathVariable("id") String id, @RequestParam String templateId) {
    Optional<TemplateDto> template = templateService.findById(templateId);
    if (template.isEmpty()) {
      return false;
    }
    return dataService.delete(id, template.get().getDataCollectionName()) > 0;
  }

  /**
   * Descarga de archivo con datos de la plantilla buscada
   *
   * @return file
   */
  @GetMapping("/download")
  public ResponseEntity<Resource> getFile(@RequestParam String filter, @RequestParam String[] filterFields,
                                          Pageable pageable, @RequestParam String unidadId, @RequestParam String templateId) {
    Optional<TemplateDto> template = templateService.findById(templateId);
    if (template.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    String filename = template.get().getNombre() + ".xlsx";
    InputStreamResource file = new InputStreamResource(
        dataService.load(filter, Arrays.asList(filterFields), pageable, unidadId, templateId, template.get().getDataCollectionName())
    );

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
        .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
        .body(file);
  }
}
