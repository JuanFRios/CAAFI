package co.com.caafi.rest;

import co.com.caafi.model.Config;
import co.com.caafi.model.ConfigTemplate;
import co.com.caafi.model.User;
import co.com.caafi.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping(path = "/rest/config")
public class ConfigResource {

	@Autowired
	private ConfigService configService;

	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/byname/{name}", method = RequestMethod.GET)
	public Config findByName(@PathVariable String name) {
		return this.configService.findByName(name);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/public/byname/{name}", method = RequestMethod.GET)
	public Config findPublicConfigByName(@PathVariable String name) {
		return this.configService.findPublicConfigByName(name);
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/template/role/{name}", method = RequestMethod.GET)
	public ConfigTemplate findTemplateConfigByRol(@PathVariable String name, Authentication authentication) {
		return this.configService.findTemplateConfigByRol((User) authentication.getPrincipal(), name);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/reportdependencies", method = RequestMethod.GET)
	public Config findDependencies() {
		return this.configService.findReportDependencies(null);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/reportdependency/{dependency}", method = RequestMethod.GET)
	public Config findDependency(@PathVariable String dependency) {
		return this.configService.findReportDependencies(dependency);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(path = "/public/dependencyname/{dependency}", method = RequestMethod.GET)
	public Map<String, Object> getDependencyName(@PathVariable String dependency) {
		return this.configService.getDependencyName(dependency);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public Config save(@RequestBody @Valid Config config, Authentication authentication) {
		return this.configService.save(config, (User) authentication.getPrincipal());
	}
}
