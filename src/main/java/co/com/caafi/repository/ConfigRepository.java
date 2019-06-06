package co.com.caafi.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import co.com.caafi.model.Config;

public interface ConfigRepository extends MongoRepository<Config, String> {

	public Config findByName(String name);
	
	public Config findByNameAndIsPublic(String name, boolean isPublic);

	@Query(value = "{ 'type':'parameter', 'name' : ?0 }", fields = "{ 'name': 1, 'value' : 1 }")
	public Config findParamByName(String name);

}
