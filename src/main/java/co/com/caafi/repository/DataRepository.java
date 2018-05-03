package co.com.caafi.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import co.com.caafi.model.template.FormData;

public interface DataRepository extends MongoRepository<FormData, String> {

	public FormData findById(String id);

	public List<FormData> findAll();

	public List<FormData> findByTemplate(String template, Sort sort);
	
    public FormData save(FormData data);

}
