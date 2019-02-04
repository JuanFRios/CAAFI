package co.com.caafi.rest;

import java.util.List;

import javax.validation.Valid;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import co.com.caafi.model.StringResponse;
import co.com.caafi.model.User;
import co.com.caafi.model.template.FormData;
import co.com.caafi.model.template.Template;
import co.com.caafi.service.TemplateService;

@RestController
@RequestMapping(path = "/rest/template")
public class TemplateResource {

	@Autowired
	private TemplateService templateService;

	@RequestMapping(path = "/all/", method = RequestMethod.GET)
	public List<Template> get() {
		return templateService.findAll();
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/byname/{name}", method = RequestMethod.GET)
	public Template findByName(@PathVariable String name) {
		return templateService.findByName(name);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/sendtemplatebymail/{template}", method = RequestMethod.POST, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public StringResponse sendTemplateByMail(@PathVariable String template, @RequestBody String json) throws JSONException {
		JSONObject jsonObj = new JSONObject(json);
		String emails = jsonObj.getString("emails");
		String url = jsonObj.getString("url");
		return templateService.sendTemplateByMail(template, emails, url);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public StringResponse save(@RequestBody @Valid Template data, Authentication authentication) {
		return templateService.save(data, (User) authentication.getPrincipal());
	}
}
