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
	
	@Query(value = "{ 'name' : ?0 }", fields = "{ 'config.sending' : 1, 'config.sending-percentage' : 1, 'config.sended' : 1 }")
	public Template findConfigSendingProgressByName(String template);

	@Query(value = "{ 'name' : ?0, 'config.configId' : ?1, 'isPublic': ?2 }", fields = "{ '_id': 1, 'name': 1, 'version': 1, 'isPublic': 1, 'fields': 1, 'config.$' : 1 }")
	public List<Template> findByNameAndConfigAndIsPublic(String name, String configId, boolean isPublic);

	@Query(value = "{ 'name' : ?0 }", fields = "{ 'config' : 0 }")
	public Template findByNameWithoutConfig(String template);

}
