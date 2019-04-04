package co.com.caafi.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import co.com.caafi.model.Config;
import co.com.caafi.model.ConfigTemplate;
import co.com.caafi.model.User;
import co.com.caafi.service.ConfigService;

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
}
