package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.facultad.DependenciaDto;
import co.edu.udea.caafi.repository.DependenciaRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DependenciaServiceImpl implements DependenciaService {

  private final ModelMapper modelMapper;
  private final DependenciaRepository dependenciaRepository;

  @Autowired
  public DependenciaServiceImpl(ModelMapper modelMapper, DependenciaRepository dependenciaRepository) {
    this.modelMapper = modelMapper;
    this.dependenciaRepository = dependenciaRepository;
  }

  /**
   * Obtiene una dependencia por código
   *
   * @param codigoDependencia código de la dependencia
   * @return Dto de la dependencia encontrada
   */
  @Override
  public Optional<DependenciaDto> findByCodigo(String codigoDependencia) {
    return dependenciaRepository.findByCodigo(codigoDependencia)
        .map(dependencia -> modelMapper.map(dependencia, DependenciaDto.class));
  }
}
