package co.com.caafi.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.com.caafi.model.Workplan;
import co.com.caafi.service.WorkplanService;

@RestController
@RequestMapping(path = "/rest/workplan")
public class WorkplanResource {
	
	@Autowired
	private WorkplanService workplanService;
	
	@GetMapping
	public List<Workplan> getAll() {
		return this.workplanService.getAll();
	}
}
