package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.facultad.UnidadDto;
import co.edu.udea.caafi.repository.UnidadRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UnidadServiceImpl implements UnidadService {

  private final ModelMapper modelMapper;

  private final UnidadRepository unidadRepository;

  public UnidadServiceImpl(ModelMapper modelMapper, UnidadRepository unidadRepository) {
    this.modelMapper = modelMapper;
    this.unidadRepository = unidadRepository;
  }

  public Optional<UnidadDto> findById(String id) {
    return unidadRepository.findById(id).map(unidad -> modelMapper.map(unidad, UnidadDto.class));
  }
}
