package co.com.caafi.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
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
	
	@Autowired
    private TaskExecutor taskExecutor;
	
	@Autowired
	private ConfigService configService;
	
	@Autowired
	public LogService logService;
	
	Logger logger = LoggerFactory.getLogger(TemplateService.class);

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
		List<Template> lstTemplate = this.templateRepository.findByName(templateName);
		if (lstTemplate != null && !lstTemplate.isEmpty()) {
			Template template = lstTemplate.get(0);
			Map<String, Object> config = template.getConfig();
			if (config != null) {
				if ("encuesta-de-materias".equals(templateName)) {
					taskExecutor.execute(new Runnable() {
			            @Override
			            public void run() {
			            	sendStudentsEmails(template);
			            }
			        });
				} else {
					int sended = 0;
					try {
						String[] emailsSpl = ((String) config.get("emails")).split(",");
						int total = emailsSpl.length;
						config.put("sending", true);
						config.put("sending-percentage", 0);
						config.put("sended", sended);
						updateConfig(template);
						for(String email : emailsSpl) {
							String url = ((String) config.get("url")) + "/" + (new Date()).getTime();
							emailService.sendEmail(email, (String) config.get("subject"), 
									((String) config.get("message")).replaceAll("(\r\n|\n)", "<br />")
										.replaceAll("\\{nombrePrograma\\}", (String) config.get("dependency"))
										.replaceAll("\\{enlace\\}", "<a href=\"" + url + "\">Por favor haz click aquí para ir a la encuesta</a>"));
							sended++;
							int current = (sended * 100) / total;
							config.put("sending-percentage", current);
							updateConfig(template);
						}
						config.put("sending", false);
						config.put("sended", sended);
						updateConfig(template);
					} catch (Exception e) {
						logger.error("Error en envío de correos de encuestas, error: " + e.getMessage());
						this.logService.error("Error en envío de correos de encuestas", e.getMessage());
						config.put("sending-error", e.getMessage());
						config.put("sending", false);
						config.put("sended", sended);
						updateConfig(template);
					}
					
				}
			}
		}
		return new StringResponse("OK");
	}
	
	private void sendStudentsEmails(Template template) {
		Map<String, Object> config = template.getConfig();
		int sended = 0;
		try {
			config.put("sending", true);
			config.put("sending-percentage", -1);
			config.put("sended", sended);
			updateConfig(template);
			List<Student> students = null;
			if ((boolean) this.configService.findParamByName("TESTING").getValue()) {
				students = this.studentService.findByCedula((int) this.configService.findParamByName("TESTING_CEDULA").getValue());
			} else {
				students = this.studentService.findAll();
			}
			int total = students.size();
			int count = 0;
			config.put("sending-percentage", 0);
			updateConfig(template);
			for (Student student: students) {
				String url = ((String) config.get("url")) + "/" + student.getCodigoPrograma() + "/" + student.getCodigoMateria() +
						"/" + student.getGrupo() + "/" + student.getCedula();
				
				// Envio a emails personales
				/*
				if (student.getEmail() != null && !"".equals(student.getEmail())) {
					emailService.sendEmail(student.getEmail(), 
							((String) config.get("subject")).replaceAll("\\{nombreMateria\\}", group.getNombreMateria()), 
							((String) config.get("message")).replaceAll("(\r\n|\n)", "<br />")
								.replaceAll("\\{enlace\\}", "<a href=\"" + url + "\">Por favor haz click aquí para ir a la encuesta</a>"));
				}
				*/
				
				// Envio a emails institucionales
				if (student.getEmailInstitucional() != null && !"".equals(student.getEmailInstitucional())) {
					emailService.sendEmail(student.getEmailInstitucional(), 
							((String) config.get("subject")).replaceAll("\\{nombreMateria\\}", student.getNombreMateria()), 
							((String) config.get("message")).replaceAll("(\r\n|\n)", "<br />")
								.replaceAll("\\{enlace\\}", "<a href=\"" + url + "\">Por favor haz click aquí para ir a la encuesta</a>"));
					sended++;
				}
				count++;
				int current = (count * 100) / total;
				config.put("sending-percentage", current);
				updateConfig(template);
			}
			config.put("sending", false);
			config.put("sended", sended);
			updateConfig(template);
		} catch (Exception e) {
			logger.error("Error en envío de correos de encuestas, error: " + e.getMessage());
			this.logService.error("Error en envío de correos de encuestas", e.getMessage());
			config.put("sending-error", e.getMessage());
			config.put("sending", false);
			config.put("sended", sended);
			updateConfig(template);
		}
	}

	public StringResponse save(Template data, User user) {
		Query query = new Query();
		query.addCriteria(Criteria.where("name").is(data.getName()));
		Update update = new Update();
		data.getConfig().put("configCreator", user.getDocument());
		update.set("config", data.getConfig());
		WriteResult result = mongoTemplate.updateFirst(query, update, Template.class);
		return new StringResponse(result == null ? "0" : result.getN() + "");
    }
	
	public StringResponse updateConfig(Template template) {
		Query query = new Query();
		query.addCriteria(Criteria.where("name").is(template.getName()));
		Update update = new Update();
		update.set("config", template.getConfig());
		WriteResult result = mongoTemplate.updateFirst(query, update, Template.class);
		return new StringResponse(result == null ? "0" : result.getN() + "");
    }
	
	@Scheduled(cron = "0 0 1 * * ?", zone="America/Bogota")
	public void scheduleTaskSendPolls() {
	  
	    long now = System.currentTimeMillis() / 1000;
	    System.out.println(
	      "schedule tasks using cron jobs - " + now);
	}
	
	public Map<String, Object> getSendingProgress(String template) {
		return this.templateRepository.findConfigSendingProgressByName(template).getConfig();
	}
}
