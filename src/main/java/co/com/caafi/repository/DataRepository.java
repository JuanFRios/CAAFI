package co.com.caafi.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import co.com.caafi.model.template.Data;

public interface DataRepository extends MongoRepository<Data, String> {

	public Data findById(String id);

	public List<Data> findAll();

	public List<Data> findByTemplate(String template);

}
