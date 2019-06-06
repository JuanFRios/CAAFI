package co.com.caafi.service;

import java.util.ArrayList;
import java.util.HashMap;
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

import co.com.caafi.model.Group;
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
	
	public Template findPublicTemplateByNameAndConfig(String name, String configId) {
		return this.templateRepository.findByNameAndConfigAndIsPublic(name, configId, true).get(0);
	}

	public List<Template> findAll() {
		return this.templateRepository.findAll();
	}

	public StringResponse sendTemplateByMail(String templateName, String configId) {
		List<Template> lstTemplate = this.templateRepository.findByName(templateName);
		if (lstTemplate != null && !lstTemplate.isEmpty()) {
			Template template = lstTemplate.get(0);
			List<Map<String, Object>> configs = template.getConfig();
			if (configs != null && !configs.isEmpty()) {
				Map<String, Object> config = configs.get(0);
				if ("encuesta-de-materias".equals(templateName)) {
					taskExecutor.execute(new Runnable() {
			            @Override
			            public void run() {
			            	sendStudentsEmails(template);
			            }
			        });
				} else {
					String[] emailsSpl = ((String) config.get("emails")).split(",");
					for(String email : emailsSpl) {
						String url = ((String) config.get("url"));
						emailService.sendEmail(email, (String) config.get("subject"), 
								(String) config.get("message") + "\n\n" + url);
					}
				}
			}
		}
		return new StringResponse("OK");
	}
	
	private void sendStudentsEmails(Template template) {
		Map<String, Object> config = template.getConfig().get(0);
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
			this.logService.error("Error en envío de correos de encuestas, error: " + e.getMessage(), null);
			config.put("sending-error", e.getMessage());
			config.put("sending", false);
			config.put("sended", sended);
			updateConfig(template);
		}
	}

	private Map<String, Object> getTemplateConfigByConfigId(String templateName, String configId) {
		Template template = findTemplateConfig(templateName, configId);
		if (template != null && template.getConfig() != null) {
			return template.getConfig().get(0);
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

	public Template findTemplateConfig(String template, String configId) {
		return this.templateRepository.findByNameAndConfigId(template, configId);
	}
	
	public Map<String, Object> getSendingProgress(String template) {
		return this.templateRepository.findConfigSendingProgressByName(template).getConfig().get(0);
	}

	public Template findTemplateWithoutConfig(String template) {
		return this.templateRepository.findByNameWithoutConfig(template);
	}
}
