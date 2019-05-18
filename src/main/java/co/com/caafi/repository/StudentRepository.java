package co.com.caafi.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import co.com.caafi.model.Student;

public interface StudentRepository extends MongoRepository<Student, String> {

	public Optional<Student> findByCodigoProgramaAndCodigoMateriaAndGrupo(int program, int matter, int group);
	
}
