package co.edu.udea.caafi.repository;

import co.edu.udea.caafi.model.facultad.Unidad;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnidadRepository extends MongoRepository<Unidad, String> {
}
