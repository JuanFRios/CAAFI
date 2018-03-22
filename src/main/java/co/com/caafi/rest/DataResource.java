package co.com.caafi.rest;

import java.util.List;

import javax.validation.Valid;

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

import co.com.caafi.model.User;
import co.com.caafi.model.template.FormData;
import co.com.caafi.service.DataService;

@RestController
@RequestMapping(path = "/rest/data")
public class DataResource {

	@Autowired
	private DataService dataService;

	@RequestMapping(path = "/all/", method = RequestMethod.GET)
	public List<FormData> get() {
		return dataService.findAll();
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/byJson/{json:.+}/{fields:.+}", method = RequestMethod.GET)
	public List<Object> getByJson(@PathVariable String json,@PathVariable String fields) {
		return dataService.findByJson(json,fields);
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/byid/{id}", method = RequestMethod.GET)
	public FormData findById(@PathVariable int id) {
		return dataService.findById(id);
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/bytemplate/{template}", method = RequestMethod.GET)
	public List<FormData> findByTemplate(@PathVariable String template) {
		return dataService.findByTemplate(template);
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public FormData save(@RequestBody @Valid FormData data, Authentication authentication) {
		return dataService.save(data, (User) authentication.getPrincipal());
	}
}
