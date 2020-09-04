package co.edu.udea.caafi.repository;

import co.edu.udea.caafi.model.facultad.Dependencia;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DependenciaRepository extends MongoRepository<Dependencia, String> {

  /**
   * Obtiene una dependencia por código
   *
   * @param codigo código de la dependencia
   * @return dependencia encontrada
   */
  Optional<Dependencia> findByCodigo(String codigo);
}
