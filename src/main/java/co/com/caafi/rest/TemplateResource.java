package co.com.caafi.rest;

import java.util.List;
import java.util.Map;

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
	@RequestMapping(path = "/public/byname/{name}", method = RequestMethod.GET)
	public Template findPublicTemplateByName(@PathVariable String name) {
		return templateService.findPublicTemplateByName(name);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/sendtemplatebymail/{template}", method = RequestMethod.POST, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public StringResponse sendTemplateByMail(@PathVariable String template) throws JSONException {
		return templateService.sendTemplateByMail(template);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/config", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public StringResponse save(@RequestBody @Valid Template data, Authentication authentication) {
		return templateService.save(data, (User) authentication.getPrincipal());
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/sendingprogress/{template}", method = RequestMethod.GET)
	public Map<String, Object> getSendingProgress(@PathVariable String template) {
		return templateService.getSendingProgress(template);
	}
}
