package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.template.DataDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface DataService {

  Optional<DataDto> save(DataDto entityDto);

  Page<DataDto> findAll(String filter, List<String> filterFields, Pageable pageable, String template, String dependencia);

  Optional<DataDto> findById(String id, String template);

  Optional<DataDto> update(String id, DataDto entityDto);

  long delete(String id, String template);
}
