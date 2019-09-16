package co.com.caafi.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import co.com.caafi.model.Workplan;

@Repository
public interface WorkplanRepository extends MongoRepository<Workplan, String> {

}
