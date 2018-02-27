package co.com.caafi.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import co.com.caafi.model.ConfigTemplate;

public interface ConfigTemplateRepository extends MongoRepository<ConfigTemplate, String> {

	public ConfigTemplate findByName(String name);

}
