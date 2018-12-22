package co.com.caafi.service;

import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.StringResponse;
import co.com.caafi.model.template.Template;
import co.com.caafi.repository.TemplateRepository;

@Service
public class TemplateService {
	
	@Autowired
	private TemplateRepository templateRepository;
	
	@Autowired
	private EmailService emailService;

	public Template findByName(String name) {
		return this.templateRepository.findByName(name).get(0);
	}

	public List<Template> findAll() {
		return this.templateRepository.findAll();
	}

	public StringResponse sendTemplateByMail(String template, String emails, String url) throws JSONException {
		String[] emailsSpl = emails.split(",");
		for(String email : emailsSpl) {
			emailService.sendEmail(email, "Encuesta Caafi", url);
		}
		return new StringResponse("OK");
	}
}
