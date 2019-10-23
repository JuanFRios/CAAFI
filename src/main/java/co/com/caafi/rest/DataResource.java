package co.com.caafi.rest;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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

	@CrossOrigin(origins = "*")
	@RequestMapping(path = "", method = RequestMethod.GET)
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
	public FormData findById(@PathVariable String id) {
		return dataService.findById(id);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/byid/{id}", method = RequestMethod.DELETE)
	@ResponseStatus(HttpStatus.OK)
	public void deleteById(@PathVariable String id, Authentication authentication) {
		dataService.deleteById(id, (User) authentication.getPrincipal());
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/bytemplate/{template}", method = RequestMethod.GET)
	public List<FormData> findByTemplate(@PathVariable String template, 
			@RequestParam("dependency") String dependency, @RequestParam("filter") String filter,
			@RequestParam("sortColumn") String sortColumn, @RequestParam("sortOrder") String sortOrder, 
			@RequestParam("pageNumber") int pageNumber, @RequestParam("pageSize") int pageSize,
			@RequestParam("filters") String filters) {
		return dataService.findByTemplate(template, dependency, filter, sortColumn, 
				sortOrder, pageNumber, pageSize, filters);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/bytemplate2/{template}", method = RequestMethod.GET)
	public List<FormData> findByTemplate(@PathVariable String template, @RequestParam("filter") String filter,
			@RequestParam("sortColumn") String sortColumn, @RequestParam("sortOrder") String sortOrder, 
			@RequestParam("pageNumber") int pageNumber, @RequestParam("pageSize") int pageSize,
			@RequestParam("filters") String filters) {
		return dataService.findByTemplate(template, filter, sortColumn, sortOrder, pageNumber, pageSize, filters);
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public FormData save(@RequestBody @Valid FormData data, Authentication authentication) {
		return dataService.save(data, authentication);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/count/{template}", method = RequestMethod.GET)
	public FormData count(@PathVariable String template, @RequestParam("dependency") String dependency,
			@RequestParam("filter") String filter, @RequestParam("filters") String filters) {
		return dataService.count(template, dependency, filter, filters);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/public/getByFormAndCreator/{semester}/{formId}/{creator}", method = RequestMethod.GET)
	public Optional<FormData> getByFormAndCreator(@PathVariable String semester, @PathVariable String formId, 
			@PathVariable String creator) {
		return dataService.getByFormAndCreator(semester, formId, creator);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/bycollection/{collection}", method = RequestMethod.GET)
	public List<Object> findByCollection(@PathVariable String collection,
			@RequestParam(value = "sortColumn", defaultValue = "savedDate") final String sortColumn, 
			@RequestParam(value = "sortOrder", defaultValue = "desc") final String sortOrder, 
			@RequestParam(value = "pageNumber", defaultValue = "0") final int pageNumber, 
			@RequestParam(value = "pageSize", defaultValue = "5") final int pageSize,
			@RequestParam(value = "filters", defaultValue = "{}") String filters) {
		return dataService.findByCollection(collection, sortColumn, sortOrder, pageNumber, pageSize, filters);
	}
}
