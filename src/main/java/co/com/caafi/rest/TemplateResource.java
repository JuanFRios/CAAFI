package co.com.caafi.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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
	@RequestMapping(path = "/sendtemplatebymail/{name}", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public String sendTemplateByMail(@PathVariable String template, @RequestParam String emails) {
		return templateService.sendTemplateByMail(template, emails);
	}
}
