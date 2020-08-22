package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.template.formulario.FormularioDto;
import co.edu.udea.caafi.model.template.formulario.Formulario;
import co.edu.udea.caafi.repository.FormularioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Servicio para la gestión de formularios
 */
@Service
public class FormularioServiceImpl implements FormularioService {

  private final ModelMapper modelMapper;

  private final FormularioRepository formularioRepository;

  @Autowired
  public FormularioServiceImpl(ModelMapper modelMapper, FormularioRepository formularioRepository) {
    this.modelMapper = modelMapper;
    this.formularioRepository = formularioRepository;
  }

  /**
   * Obtiene un formulario a partir del id
   *
   * @param id identificador del dormulario
   * @return DTO del formulario
   */
  public FormularioDto findById(String id) {
    Optional<Formulario> formulario = formularioRepository.findById(id);
    return formulario.map(value -> modelMapper.map(value, FormularioDto.class)).orElse(null);
  }
}
