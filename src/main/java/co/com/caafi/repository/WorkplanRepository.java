package co.com.caafi.repository;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import co.com.caafi.model.Workplan;

@Repository
public interface WorkplanRepository extends MongoRepository<Workplan, String> {
	
	@Query("{ $where: '(JSON.stringify(this).toLowerCase().indexOf( ?0.toLowerCase() ) != -1);' }")
    List<Workplan> customFindAll(String filter, PageRequest pageRequest);
}
