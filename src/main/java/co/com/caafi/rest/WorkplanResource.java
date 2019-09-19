package co.com.caafi.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.com.caafi.model.Workplan;
import co.com.caafi.service.WorkplanService;

@RestController
@RequestMapping(path = "/rest/workplan")
public class WorkplanResource {
	
	@Autowired
	private WorkplanService workplanService;
	
	@CrossOrigin(origins = "*")
	@GetMapping()
    public List<Workplan> get(@RequestParam String filter, @RequestParam String sortColumn,
                                  @RequestParam String sortDirection, @RequestParam int pageIndex,
                                  @RequestParam int pageSize) {
        return this.workplanService.get(filter, sortColumn, sortDirection, pageIndex, pageSize);
    }

	@CrossOrigin(origins = "*")
    @GetMapping("/count")
    public long get() {
        return this.workplanService.countAll();
    }
}
