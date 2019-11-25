package co.com.caafi.rest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    public List<Workplan> get(@RequestParam String textFilter, @RequestParam String sortColumn,
                                  @RequestParam String sortDirection, @RequestParam int pageIndex,
                                  @RequestParam int pageSize, @RequestParam String filters) {
        return this.workplanService.get(textFilter, sortColumn, sortDirection, pageIndex, pageSize, filters);
    }

	@CrossOrigin(origins = "*")
    @GetMapping("/count")
    public long count(@RequestParam String textFilter, @RequestParam String filters) {
        return this.workplanService.count(textFilter, filters);
    }
}
