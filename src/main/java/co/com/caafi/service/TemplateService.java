package co.com.caafi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.mongodb.WriteResult;

import co.com.caafi.model.StringResponse;
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

	public StringResponse sendTemplateByMail(String templateName) {
		Template template = findByName(templateName);
		String[] emailsSpl = ((String) template.getConfig().get("emails")).split(",");
		for(String email : emailsSpl) {
			emailService.sendEmail(email, (String) template.getConfig().get("subject"), 
					(String) template.getConfig().get("message") + "\n\n" + (String) template.getConfig().get("url"));
		}
		
		studentService.getStudentsByPrograma("BIOINGENIERÍA");
		
		return new StringResponse("OK");
	}
	
	public StringResponse save(Template data, User user) {
		Query query = new Query();
		query.addCriteria(Criteria.where("name").is(data.getName()));
		Update update = new Update();
		update.set("config", data.getConfig());
		update.set("configCreator", user.getDocument());
		WriteResult result = mongoTemplate.updateFirst(query, update, Template.class);
		return new StringResponse(result == null ? "0" : result.getN() + "");
    }
	
	@Scheduled(cron = "0 0 1 * * ?", zone="America/Bogota")
	public void scheduleTaskSendPolls() {
	  
	    long now = System.currentTimeMillis() / 1000;
	    System.out.println(
	      "schedule tasks using cron jobs - " + now);
	}
}
