package co.com.caafi.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import co.com.caafi.model.Student;

public interface StudentRepository extends MongoRepository<Student, String> {

	public List<Student> getByPrograma(String programa);
	
}
