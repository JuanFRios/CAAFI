package co.edu.udea.caafi.repository;

import co.edu.udea.caafi.model.template.formulario.Formulario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio de fomrularios
 */
@Repository
public interface FormularioRepository extends MongoRepository<Formulario, String> {
}
