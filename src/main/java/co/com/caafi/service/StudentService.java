package co.com.caafi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import co.com.caafi.model.Group;
import co.com.caafi.model.Matter;
import co.com.caafi.model.Program;
import co.com.caafi.model.Student;

@Service
public class StudentService {
	
	@Autowired
    MongoTemplate mongoTemplate;
	
	public List<Student> getStudentsByProgram(String programa) {	
		GroupOperation group = Aggregation.group("cedula", "email", "emailInstitu");
		MatchOperation filter = Aggregation.match(new Criteria("programa").is(programa));
		Aggregation aggregation = Aggregation.newAggregation(filter, group);
		return mongoTemplate.aggregate(aggregation, "student", Student.class).getMappedResults();
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
		GroupOperation groupOp = Aggregation.group("emailInstitu").first("emailInstitu").as("emailInstitu");
		MatchOperation filter = Aggregation.match(new Criteria("codigoPrograma").is(program).and("codigoMateria").is(matter).and("grupo").is(group));
		SortOperation sort = Aggregation.sort(Direction.ASC, "emailInstitu");
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

	public List<Student> getEmailsByMatterAndGroup(int matter, int group) {
		GroupOperation groupOp = Aggregation.group("emailInstitu").first("emailInstitu").as("emailInstitu");
		MatchOperation filter = Aggregation.match(new Criteria("codigoMateria").is(matter).and("grupo").is(group));
		SortOperation sort = Aggregation.sort(Direction.ASC, "emailInstitu");
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
				new Criteria("email").is(email), new Criteria("emailInstitu").is(email)));
		SortOperation sort = Aggregation.sort(Direction.ASC, "cedula");
		Aggregation aggregation = Aggregation.newAggregation(filter, group, sort);
		return mongoTemplate.aggregate(aggregation, "student", Student.class).getMappedResults();
	}

}