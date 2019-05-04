package co.com.caafi.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import co.com.caafi.model.Log;

public interface LogRepository extends MongoRepository<Log, String> {
	
}
