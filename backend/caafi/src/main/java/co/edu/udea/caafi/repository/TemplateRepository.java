package co.edu.udea.caafi.repository;

import co.edu.udea.caafi.model.template.Template;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TemplateRepository extends MongoRepository<Template, String> {
}
