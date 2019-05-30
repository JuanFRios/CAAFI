package co.com.caafi.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.mongodb.WriteResult;

import co.com.caafi.model.StringResponse;
import co.com.caafi.model.Student;
import co.com.caafi.model.User;
import co.com.caafi.model.template.Template;
import co.com.caafi.repository.TemplateRepository;

@Service
public class TemplateService {
	
	@Autowired
	private TemplateRepository templateRepository;
	
	@Autowired
    MongoTemplate mongoTemplate;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private StudentService studentService;

	public Template findByName(String name) {
		return this.templateRepository.findByName(name).get(0);
	}
	
	public Template findPublicTemplateByName(String name) {
		return this.templateRepository.findByNameAndIsPublic(name, true).get(0);
	}

	public List<Template> findAll() {
		return this.templateRepository.findAll();
	}

	public StringResponse sendTemplateByMail(String templateName, String configId) {
		Map<String, Object> config = getTemplateConfigByConfigId(templateName, configId);
		String[] emailsSpl = ((String) config.get("emails")).split(",");
		for(String email : emailsSpl) {
			String url = ((String) config.get("url"));
			if ("encuesta-de-materias".equals(templateName)) {
				List<Student> students = studentService.getStudentByEmail(email);
				if (!students.isEmpty()) {
					url += "/" + students.get(0).getCedula();
				}
			}
			emailService.sendEmail(email, (String) config.get("subject"), 
					(String) config.get("message") + "\n\n" + url);
		}
		//sendStudentsEmails(config);
		return new StringResponse("OK");
	}
	
	private void sendStudentsEmails(Map<String, Object> config) {
		List<Student> students = null;
		if ((boolean) config.get("allEmails")) {
			students = studentService.getEmailsByMatterAndGroup(Integer.parseInt((String) config.get("matter")), Integer.parseInt((String) config.get("group")));
		} else {
			students = studentService.getEmailsByProgramAndMatterAndGroup(Integer.parseInt((String) config.get("program")), Integer.parseInt((String) config.get("matter")), Integer.parseInt((String) config.get("group")));
		}
		for (Student student : students) {
			String url = ((String) config.get("url")) + "/" + student.getCedula();
			if (student.getEmail() != null && !"".equals(student.getEmail())) {
				emailService.sendEmail(student.getEmail(), (String) config.get("subject"), 
						(String) config.get("message") + "\n\n" + url);
			}
			if (student.getEmailInstitu() != null && !"".equals(student.getEmailInstitu())) {
				emailService.sendEmail(student.getEmailInstitu(), (String) config.get("subject"), 
						(String) config.get("message") + "\n\n" + url);
			}
		}
	}

	private Map<String, Object> getTemplateConfigByConfigId(String templateName, String configId) {
		Template template = findByName(templateName);
		for (Map<String, Object> config : template.getConfig()) {
			if (config.get("configId").equals(configId)) {
				return config;
			}
		}
		return null;
	}

	public StringResponse save(Template data, User user) {
		Template template = findByName(data.getName()); 
		List<Map<String, Object>> configs = template.getConfig();
		if (configs == null) {
			configs = new ArrayList<Map<String, Object>>();
		}
		int pos = 0;
		for (Map<String, Object> config : configs) {
			if (config.get("configId").equals(data.getConfig().get(0).get("configId"))) {
				configs.set(pos, data.getConfig().get(0));
				break;
			}
			pos++;
		}
		if (pos == configs.size()) {
			configs.add(data.getConfig().get(0));
		}
		Query query = new Query();
		query.addCriteria(Criteria.where("name").is(data.getName()));
		Update update = new Update();
		data.getConfig().get(0).put("configCreator", user.getDocument());
		update.set("config", configs);
		WriteResult result = mongoTemplate.updateFirst(query, update, Template.class);
		return new StringResponse(result == null ? "0" : result.getN() + "");
    }
	
	@Scheduled(cron = "0 0 1 * * ?", zone="America/Bogota")
	public void scheduleTaskSendPolls() {
	  
	    long now = System.currentTimeMillis() / 1000;
	    System.out.println(
	      "schedule tasks using cron jobs - " + now);
	}

	public Template findTemplateConfig(String template, String configId) {
		return this.templateRepository.findByNameAndConfigId(template, configId);
	}
}
