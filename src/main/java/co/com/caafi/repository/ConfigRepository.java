package co.com.caafi.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import co.com.caafi.model.Config;

public interface ConfigRepository extends MongoRepository<Config, String> {

	public Config findByName(String name);
	
	public Config findByNameAndIsPublic(String name, boolean isPublic);

	@Query(value = "{ 'name' : ?0, 'value.name' : ?1 }", fields = "{ 'value.$' : 1 }")
	public Object findParamByName(String name);

}
