package co.com.caafi.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import co.com.caafi.model.Template;
import co.com.caafi.service.TemplateService;

@RestController
@RequestMapping(path = "/rest/template")
public class TemplateResource {

	@Autowired
	private TemplateService templateResource;

	@RequestMapping(path = "/all/", method = RequestMethod.GET)
	public List<Template> get() {
		return templateResource.findAll();
	}

	@RequestMapping(path = "/byname/{name}", method = RequestMethod.GET)
	public Template findByName(@PathVariable String name) {
		return templateResource.findByName(name);
	}
}
