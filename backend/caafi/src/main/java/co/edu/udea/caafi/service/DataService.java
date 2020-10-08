package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.template.DataDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Optional;

public interface DataService {

  Page<DataDto> findAll(String filter, List<String> filterFields, Pageable pageable, String unidadId, String templateId,
                        String collectionName);

  Optional<DataDto> save(DataDto entityDto, String collectionName);

  Optional<DataDto> findById(String id, String collectionName);

  Optional<DataDto> update(String id, DataDto entityDto, String collectionName);

  long delete(String id, String collectionName);

  ByteArrayInputStream load(String filter, List<String> filterFields, Pageable pageable, String unidadId, String templateId,
                            String collectionName);
}
