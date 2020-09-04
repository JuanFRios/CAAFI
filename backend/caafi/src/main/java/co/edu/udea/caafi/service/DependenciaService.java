package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.facultad.DependenciaDto;

import java.util.Optional;

public interface DependenciaService {

  /**
   * Obtiene una dependencia por código
   *
   * @param codigoDependencia código de la dependencia
   * @return Dto de la dependencia encontrada
   */
  Optional<DependenciaDto> findByCodigo(String codigoDependencia);
}
