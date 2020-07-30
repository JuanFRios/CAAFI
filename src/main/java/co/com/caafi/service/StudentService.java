package co.com.caafi.service;

import co.com.caafi.model.*;
import co.com.caafi.repository.StudentRepository;
import co.com.caafi.service.rest.RestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StudentService extends RestService {
	
	@Autowired
    MongoTemplate mongoTemplate;
	
	@Autowired
	StudentRepository studentRepository;
	
	@Autowired
	ConfigService configService;
	
	Logger logger = LoggerFactory.getLogger(StudentService.class);
	
	public List<Student> getStudentsByProgram(String programa) {	
		GroupOperation group = Aggregation.group("cedula", "email", "emailInstitucional");
		MatchOperation filter = Aggregation.match(new Criteria("programa").is(programa));
		Aggregation aggregation = Aggregation.newAggregation(filter, group);
		return mongoTemplate.aggregate(aggregation, "student", Student.class).getMappedResults();
	}
	
	public List<Semester> getSemesters() {	
		GroupOperation group = Aggregation.group("semestre").first("semestre").as("code");
		SortOperation sort = Aggregation.sort(Direction.DESC, "semestre");
		Aggregation aggregation = Aggregation.newAggregation(group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Semester.class).getMappedResults();
	}
	
	public List<Program> getPrograms() {	
		GroupOperation group = Aggregation.group("codigoPrograma").first("codigoPrograma").as("code").first("nombrePrograma").as("name");
		SortOperation sort = Aggregation.sort(Direction.ASC, "code");
		Aggregation aggregation = Aggregation.newAggregation(group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Program.class).getMappedResults();
	}

	public List<Matter> getMattersByProgram(int program) {
		GroupOperation group = Aggregation.group("codigoMateria").first("codigoMateria").as("code").first("nombreMateria").as("name");
		MatchOperation filter = Aggregation.match(new Criteria("codigoPrograma").is(program));
		SortOperation sort = Aggregation.sort(Direction.ASC, "code");
		Aggregation aggregation = Aggregation.newAggregation(filter, group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Matter.class).getMappedResults();
	}

	public List<Group> getGroupsByProgramAndMatter(int program, int matter) {
		GroupOperation group = Aggregation.group("grupo").first("grupo").as("code");
		MatchOperation filter = Aggregation.match(new Criteria("codigoPrograma").is(program).and("codigoMateria").is(matter));
		SortOperation sort = Aggregation.sort(Direction.ASC, "code");
		Aggregation aggregation = Aggregation.newAggregation(filter, group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Group.class).getMappedResults();
	}

	public List<Student> getEmailsByProgramAndMatterAndGroup(int program, int matter, int group) {
		GroupOperation groupOp = Aggregation.group("cedula").first("emailInstitucional").as("emailInstitucional").first("email").as("email").first("cedula").as("cedula");
		MatchOperation filter = Aggregation.match(new Criteria("codigoPrograma").is(program).and("codigoMateria").is(matter).and("grupo").is(group));
		SortOperation sort = Aggregation.sort(Direction.ASC, "emailInstitucional");
		Aggregation aggregation = Aggregation.newAggregation(filter, groupOp, sort);
		return mongoTemplate.aggregate(aggregation, "student", Student.class).getMappedResults();
	}

	public List<Matter> getMatters() {
		GroupOperation group = Aggregation.group("codigoMateria").first("codigoMateria").as("code").first("nombreMateria").as("name");
		SortOperation sort = Aggregation.sort(Direction.ASC, "code");
		Aggregation aggregation = Aggregation.newAggregation(group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Matter.class).getMappedResults();
	}
	
	public List<Group> getGroupsByMatter(int matter) {
		GroupOperation group = Aggregation.group("grupo").first("grupo").as("code");
		MatchOperation filter = Aggregation.match(new Criteria("codigoMateria").is(matter));
		SortOperation sort = Aggregation.sort(Direction.ASC, "code");
		Aggregation aggregation = Aggregation.newAggregation(filter, group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Group.class).getMappedResults();
	}
	
	public List<Group> getAllGroupsByMatterByProgram() {
		GroupOperation group = Aggregation.group("codigoPrograma", "codigoMateria", "grupo")
				.first("codigoPrograma").as("programCode").first("grupo").as("code").first("codigoMateria").as("matterCode")
				.first("nombreMateria").as("nombreMateria");
		Aggregation aggregation = Aggregation.newAggregation(group);
		return mongoTemplate.aggregate(aggregation, "student", Group.class).getMappedResults();
	}

	public List<Student> getEmailsByMatterAndGroup(int matter, int group) {
		GroupOperation groupOp = Aggregation.group("cedula").first("emailInstitucional").as("emailInstitucional").first("email").as("email").first("cedula").as("cedula");
		MatchOperation filter = Aggregation.match(new Criteria("codigoMateria").is(matter).and("grupo").is(group));
		SortOperation sort = Aggregation.sort(Direction.ASC, "emailInstitucional");
		Aggregation aggregation = Aggregation.newAggregation(filter, groupOp, sort);
		return mongoTemplate.aggregate(aggregation, "student", Student.class).getMappedResults();
	}

	public Program getProgramByCode(int code) {
		GroupOperation group = Aggregation.group("codigoPrograma").first("codigoPrograma").as("code").first("nombrePrograma").as("name");
		MatchOperation filter = Aggregation.match(new Criteria("codigoPrograma").is(code));
		SortOperation sort = Aggregation.sort(Direction.ASC, "code");
		Aggregation aggregation = Aggregation.newAggregation(filter, group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Program.class).getMappedResults().get(0);
	}

	public Matter getMatterByCode(int code) {
		GroupOperation group = Aggregation.group("codigoMateria").first("codigoMateria").as("code").first("nombreMateria").as("name");
		MatchOperation filter = Aggregation.match(new Criteria("codigoMateria").is(code));
		SortOperation sort = Aggregation.sort(Direction.ASC, "code");
		Aggregation aggregation = Aggregation.newAggregation(filter, group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Matter.class).getMappedResults().get(0);
	}

	public List<Student> getStudentByEmail(String email) {
		GroupOperation group = Aggregation.group("cedula").first("cedula").as("cedula");
		MatchOperation filter = Aggregation.match(new Criteria().orOperator(
				new Criteria("email").is(email), new Criteria("emailInstitucional").is(email)));
		SortOperation sort = Aggregation.sort(Direction.ASC, "cedula");
		Aggregation aggregation = Aggregation.newAggregation(filter, group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Student.class).getMappedResults();
	}

	public Group getGroupByStudentAndProgramAndMatter(String cedula, int program, int matter) {
		long cedulaLong = -1;
		try {
			cedulaLong = Long.parseLong(cedula);
		} catch (Exception e) {}
		GroupOperation group = Aggregation.group("grupo").first("grupo").as("code");
		MatchOperation filter = Aggregation.match(new Criteria().orOperator(
				new Criteria("cedula").is(cedula), new Criteria("cedula").is(cedulaLong))
					.and("codigoMateria").is(matter).and("codigoPrograma").is(program));
		SortOperation sort = Aggregation.sort(Direction.ASC, "grupo");
		Aggregation aggregation = Aggregation.newAggregation(filter, group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Group.class).getMappedResults().get(0);
	}

	public Optional<Student> getGroupByProgramAndMatterAndGroup(int program, int matter, int group) {
		return this.studentRepository.findByCodigoProgramaAndCodigoMateriaAndGrupo(program, matter, group);
	}

	public List<Student> findAll() {
		return studentRepository.findAll();
	}

	public List<Student> findByCedula(int cedula) {
		return this.studentRepository.findByCedula(cedula);
	}

	public List<Student> findBySemester(int semester) {
		return this.studentRepository.findBySemestre(semester);
	}

	public List<StudentStatistics> getStudentStatistics(String program, String filters) {
		int timeout = (int) configService.findParamByName("STUDENT_STATISTICS_SERVICE_TIMEOUT").getValue();
		ClientHttpRequestFactory requestFactory = getClientHttpRequestFactory(timeout);
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		String endPoint = ((String) configService.findParamByName("STUDENT_STATISTICS_SERVICE_ENDPOINT").getValue()).replace("{programa}", program);
		if (!"{}".equals(filters)) {
			String semestre = getSemestreFromJsonFilter(filters);
			if (semestre != null) {
				endPoint = ((String) configService.findParamByName("STUDENT_STATISTICS_SERVICE_FILTER_ENDPOINT")
						.getValue()).replace("{programa}", program).replace("{semestre}", semestre);
			}
		} 
		String studentStatistics = restTemplate.getForObject(endPoint, String.class);
		JSONObject json = null;
		try {
			json = new JSONObject(studentStatistics);
		} catch (JSONException e) {
			this.logger.error("Error al convertir a JSON el String de respuesta del endPoint: " + endPoint + ", error: " + e.getMessage(), e);
		}
		if (json == null) {
			return null;
		}
		ObjectMapper mapper = new ObjectMapper();
		List<StudentStatistics> studentsStatistics = null;
		try {
			studentsStatistics = Arrays.asList(mapper.readValue(json.get("enrollsCount").toString(), StudentStatistics[].class));
		} catch (IOException | JSONException e) {
			this.logger.error("Error al convertir a Lista el json String de estadisticas de estudiantes, error: " + e.getMessage(), e);
		}
		return studentsStatistics;
	}

	private String getSemestreFromJsonFilter(String filters) {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, String> filtersMap = null;
		try {
			filtersMap = mapper.readValue(filters, Map.class);
		} catch (IOException e) {
			this.logger.error("Error al converir el json string en método getSemestreFromJsonFilter, error: " + e.getMessage(), e);
		}
		return filtersMap.get("semestre");
	}

}
