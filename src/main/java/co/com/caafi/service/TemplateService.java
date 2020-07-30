package co.com.caafi.service;

import co.com.caafi.model.*;
import co.com.caafi.model.template.Template;
import co.com.caafi.repository.TemplateRepository;
import com.mongodb.client.result.UpdateResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

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
	
	@Autowired
	private TeacherService teacherService;
	
	@Autowired
    private TaskExecutor taskExecutor;
	
	@Autowired
	private ConfigService configService;
	
	@Autowired
	public LogService logService;
	
	Logger logger = LoggerFactory.getLogger(TemplateService.class);

	public Template findByName(String name) {
		return this.templateRepository.findByName(name);
	}
	
	public Template findPublicTemplateByName(String name) {
		return this.templateRepository.findByNameAndIsPublic(name, true).get(0);
	}

	public List<Template> findAll() {
		return this.templateRepository.findAll();
	}

	public StringResponse sendTemplateByMail(String templateName, String configName) {
		Template template = this.templateRepository.findByName(templateName);
		Config config = this.configService.findByName(configName);
		if (template != null && config != null) {
			taskExecutor.execute(new Runnable() {
	            @Override
	            public void run() {
	            		if ("encuesta-de-materias".equals(templateName)) {
	            			sendStudentsEmails(template, config);
	            		} else if ("encuesta-de-materias-profesores".equals(templateName)) {
	            			sendTeachersEmails(template, config);
	            		} else {
	            			sendEmails(template, config);
	            		}
	            }
	        });
		}
		return new StringResponse("OK");
	}
	
	private void sendEmails(Template template, Config config) {
		int sended = 0;
		Map<String, Object> configValue = (Map<String, Object>) config.getValue();
		try {
			String[] emailsSpl = ((String) configValue.get("emails")).split(",");
			int total = emailsSpl.length;
			configValue.put("sending", true);
			configValue.put("sending-percentage", 0);
			configValue.put("sended", sended);
			this.configService.save(config);
			for(String email : emailsSpl) {
				String url = ((String) configValue.get("url")) + "/" + (new Date()).getTime();
				emailService.sendEmail(email, (String) configValue.get("subject"), 
						((String) configValue.get("message")).replaceAll("(\r\n|\n)", "<br />")
							.replaceAll("\\{nombrePrograma\\}", (String) configValue.get("dependency"))
							.replaceAll("\\{enlace\\}", "<a href=\"" + url + "\">Por favor haz click aquí para ir a la encuesta</a>"));
				sended++;
				int current = (sended * 100) / total;
				configValue.put("sending-percentage", current);
				this.configService.save(config);
			}
			configValue.put("sending", false);
			configValue.put("sended", sended);
			this.configService.save(config);
		} catch (Exception e) {
			logger.error("Error en envío de correos de encuestas, error: " + e.getMessage());
			this.logService.error("Error en envío de correos de encuestas", e.getMessage());
			configValue.put("sending-error", e.getMessage());
			configValue.put("sending", false);
			configValue.put("sended", sended);
			this.configService.save(config);
		}
	}
	
	private void sendStudentsEmails(Template template, Config config) {
		int sended = 0;
		Map<String, Object> configValue = (Map<String, Object>) config.getValue();
		try {
			configValue.put("sending", true);
			configValue.put("sending-percentage", -1);
			configValue.put("sended", sended);
			this.configService.save(config);
			List<Student> students = null;
			students = this.studentService.findBySemester((int)configValue.get("semester"));
			int total = students.size();
			int count = 0;
			configValue.put("sending-percentage", 0);
			this.configService.save(config);
			for (Student student: students) {
				String url = ((String) configValue.get("url")) + "/" + configValue.get("semester") + 
						"/" + student.getCodigoPrograma() + 
						"/" + student.getCodigoMateria() +
						"/" + student.getGrupo() + "/" + student.getCedula();
				
				// Envio a emails personales
				/*
				if (student.getEmail() != null && !"".equals(student.getEmail())) {
					emailService.sendEmail(student.getEmail(), 
							((String) configValue.get("subject")).replaceAll("\\{nombreMateria\\}", group.getNombreMateria()), 
							((String) configValue.get("message")).replaceAll("(\r\n|\n)", "<br />")
								.replaceAll("\\{enlace\\}", "<a href=\"" + url + "\">Por favor haz click aquí para ir a la encuesta</a>"));
				}
				*/
				
				// Envio a emails institucionales
				if (student.getEmailInstitucional() != null && !"".equals(student.getEmailInstitucional())) {
					emailService.sendEmail(student.getEmailInstitucional(), 
							((String) configValue.get("subject")).replaceAll("\\{nombreMateria\\}", student.getNombreMateria()), 
							((String) configValue.get("message")).replaceAll("(\r\n|\n)", "<br />")
								.replaceAll("\\{enlace\\}", "<a href=\"" + url + "\">Por favor haz click aquí para ir a la encuesta</a>"));
					sended++;
				}
				count++;
				int current = (count * 100) / total;
				configValue.put("sending-percentage", current);
				this.configService.save(config);
			}
			configValue.put("sending", false);
			configValue.put("sended", sended);
			this.configService.save(config);
		} catch (Exception e) {
			logger.error("Error en envío de correos de encuestas, error: " + e.getMessage());
			this.logService.error("Error en envío de correos de encuestas", e.getMessage());
			configValue.put("sending-error", e.getMessage());
			configValue.put("sending", false);
			configValue.put("sended", sended);
			this.configService.save(config);
		}
	}
	
	private void sendTeachersEmails(Template template, Config config) {
		int sended = 0;
		Map<String, Object> configValue = (Map<String, Object>) config.getValue();
		try {
			configValue.put("sending", true);
			configValue.put("sending-percentage", -1);
			configValue.put("sended", sended);
			this.configService.save(config);
			List<Teacher> teachers = null;
			teachers = this.teacherService.findBySemester((int)configValue.get("semester"));
			int total = teachers.size();
			int count = 0;
			configValue.put("sending-percentage", 0);
			this.configService.save(config);
			for (Teacher teacher: teachers) {
				String url = ((String) configValue.get("url")) + "/" + configValue.get("semester") +  
						"/" + teacher.getCodigoMateria() +
						"/" + teacher.getGrupo() + "/" + teacher.getCedula();
				
				// Envio a emails institucionales
				if (teacher.getEmailInstitucional() != null && !"".equals(teacher.getEmailInstitucional())) {
					emailService.sendEmail(teacher.getEmailInstitucional(), 
							((String) configValue.get("subject")).replaceAll("\\{nombreMateria\\}", teacher.getNombreMateria()), 
							((String) configValue.get("message")).replaceAll("(\r\n|\n)", "<br />")
								.replaceAll("\\{enlace\\}", "<a href=\"" + url + "\">Por favor haz click aquí para ir a la encuesta</a>"));
					sended++;
				}
				count++;
				int current = (count * 100) / total;
				configValue.put("sending-percentage", current);
				this.configService.save(config);
			}
			configValue.put("sending", false);
			configValue.put("sended", sended);
			this.configService.save(config);
		} catch (Exception e) {
			logger.error("Error en envío de correos de encuestas, error: " + e.getMessage());
			this.logService.error("Error en envío de correos de encuestas", e.getMessage());
			configValue.put("sending-error", e.getMessage());
			configValue.put("sending", false);
			configValue.put("sended", sended);
			this.configService.save(config);
		}
	}

	public StringResponse save(Template data, User user) {
		Query query = new Query();
		query.addCriteria(Criteria.where("name").is(data.getName()));
		Update update = new Update();
		data.getConfig().put("configCreator", user.getDocument());
		update.set("config", data.getConfig());
		UpdateResult result = mongoTemplate.updateFirst(query, update, Template.class);
		return new StringResponse(result == null ? "0" : result.getModifiedCount() + "");
    }
	
	public StringResponse updateConfig(Template template) {
		Query query = new Query();
		query.addCriteria(Criteria.where("name").is(template.getName()));
		Update update = new Update();
		update.set("config", template.getConfig());
		UpdateResult result = mongoTemplate.updateFirst(query, update, Template.class);
		return new StringResponse(result == null ? "0" : result.getModifiedCount() + "");
    }
	
	public Map<String, Object> getSendingProgress(String template) {
		return this.templateRepository.findConfigSendingProgressByName(template).getConfig();
	}
}
