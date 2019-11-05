package co.com.caafi.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import co.com.caafi.model.Config;
import co.com.caafi.model.ConfigTemplate;
import co.com.caafi.model.Group;
import co.com.caafi.model.Matter;
import co.com.caafi.model.Program;
import co.com.caafi.model.Semester;
import co.com.caafi.model.Student;
import co.com.caafi.model.Teacher;
import co.com.caafi.model.User;
import co.com.caafi.service.ConfigService;
import co.com.caafi.service.StudentService;
import co.com.caafi.service.TeacherService;

@RestController
@RequestMapping(path = "/rest/teacher")
public class TeacherResource {

	@Autowired
	private TeacherService teacherService;

	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/semesters", method = RequestMethod.GET)
	public List<Semester> findSemesters() {
		return this.teacherService.getSemesters();
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/programs", method = RequestMethod.GET)
	public List<Program> findPrograms() {
		return this.teacherService.getPrograms();
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/mattersByProgram/{program}", method = RequestMethod.GET)
	public List<Matter> findMattersByProgram(@PathVariable int program) {
		return this.teacherService.getMattersByProgram(program);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/matters", method = RequestMethod.GET)
	public List<Matter> findMatters() {
		return this.teacherService.getMatters();
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/groupsByProgramAndMatter/{program}/{matter}", method = RequestMethod.GET)
	public List<Group> findGroupsByProgramAndMatter(@PathVariable int program, @PathVariable int matter) {
		return this.teacherService.getGroupsByProgramAndMatter(program, matter);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/groupsByMatter/{matter}", method = RequestMethod.GET)
	public List<Group> findGroupsByProgramAndMatter(@PathVariable int matter) {
		return this.teacherService.getGroupsByMatter(matter);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/emailsByProgramAndMatterAndGroup/{program}/{matter}/{group}", method = RequestMethod.GET)
	public List<Student> findEmailsByProgramAndMatterAndGroup(@PathVariable int program, @PathVariable int matter, @PathVariable int group) {
		return this.teacherService.getEmailsByProgramAndMatterAndGroup(program, matter, group);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/emailsByMatterAndGroup/{matter}/{group}", method = RequestMethod.GET)
	public List<Student> findEmailsByMatterAndGroup(@PathVariable int matter, @PathVariable int group) {
		return this.teacherService.getEmailsByMatterAndGroup(matter, group);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/public/programByCode/{code}", method = RequestMethod.GET)
	public Program findProgramByCode(@PathVariable int code) {
		return this.teacherService.getProgramByCode(code);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/public/matterByCode/{code}", method = RequestMethod.GET)
	public Matter findMatterByCode(@PathVariable int code) {
		return this.teacherService.getMatterByCode(code);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/public/groupByStudentAndProgramAndMatter/{cedula}/{program}/{matter}", method = RequestMethod.GET)
	public Group findGroupByStudentAndProgramAndMatter(@PathVariable String cedula, @PathVariable int program, @PathVariable int matter) {
		try {
			return this.teacherService.getGroupByStudentAndProgramAndMatter(cedula, program, matter);
		} catch (Exception e) {
			return null;
		}
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/public/groupByTeacherAndMatter/{cedula}/{matter}", method = RequestMethod.GET)
	public Group findGroupByTeacherAndMatter(@PathVariable String cedula, @PathVariable int matter) {
		try {
			return this.teacherService.getGroupByTeacherAndMatter(cedula, matter);
		} catch (Exception e) {
			return null;
		}
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/public/getGroupByProgramAndMatterAndGroup/{program}/{matter}/{group}", method = RequestMethod.GET)
	public Optional<Teacher> getGroupByProgramAndMatterAndGroup(@PathVariable int program, @PathVariable int matter, @PathVariable int group) {
		return this.teacherService.getGroupByProgramAndMatterAndGroup(program, matter, group);
	}
}
