package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.facultad.UnidadDto;

import java.util.Optional;

public interface UnidadService {

  Optional<UnidadDto> findById(String id);
}
