package co.com.caafi.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import co.com.caafi.model.Template;

public interface TemplateRepository extends MongoRepository<Template, String> {

	public List<Template> findByName(String name);

	public List<Template> findAll();

}
