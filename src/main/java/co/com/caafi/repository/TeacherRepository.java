package co.com.caafi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import co.com.caafi.model.Student;
import co.com.caafi.model.Teacher;

public interface TeacherRepository extends MongoRepository<Teacher, String> {

	public Optional<Teacher> findByCodigoProgramaAndCodigoMateriaAndGrupo(int program, int matter, int group);

	public List<Teacher> findByCedula(int cedula);
	
	public List<Teacher> findBySemestre(int semestre);
}
