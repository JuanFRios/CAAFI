package co.com.caafi.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import co.com.caafi.model.template.Template;

public interface TemplateRepository extends MongoRepository<Template, String> {

	public List<Template> findByName(String name);
	
	public List<Template> findByNameAndIsPublic(String name, boolean isPublic);

	public List<Template> findAll();

	@Query(value = "{ 'name' : ?0, 'config.configId' : ?1 }", fields = "{ 'config.$' : 1 }")
	public Template findByNameAndConfigId(String template, String configId);

}
