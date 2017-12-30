package co.com.caafi.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import co.com.caafi.model.template.Data;
import co.com.caafi.service.DataService;

@RestController
@RequestMapping(path = "/rest/data")
public class DataResource {

	@Autowired
	private DataService dataService;

	@RequestMapping(path = "/all/", method = RequestMethod.GET)
	public List<Data> get() {
		return dataService.findAll();
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/byid/{id}", method = RequestMethod.GET)
	public Data findById(@PathVariable String id) {
		return dataService.findById(id);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/bytemplate/{template}", method = RequestMethod.GET)
	public List<Data> findByTemplate(@PathVariable String template) {
		return dataService.findByTemplate(template);
	}
}
