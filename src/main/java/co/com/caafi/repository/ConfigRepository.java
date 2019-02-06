package co.com.caafi.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import co.com.caafi.model.Config;

public interface ConfigRepository extends MongoRepository<Config, String> {

	public Config findByName(String name);
	
	public Config findByNameAndIsPublic(String name, boolean isPublic);

}
