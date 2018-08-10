package co.com.caafi.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.Config;
import co.com.caafi.model.ConfigTemplate;
import co.com.caafi.model.Dependency;
import co.com.caafi.model.Form;
import co.com.caafi.model.Role;
import co.com.caafi.model.User;
import co.com.caafi.repository.ConfigRepository;
import co.com.caafi.repository.ConfigTemplateRepository;

@Service
public class ConfigService {
	@Autowired
	private ConfigRepository configRepository;
	@Autowired
	private ConfigTemplateRepository configTemplateRepository;

	public Config findByName(String name) {
		return this.configRepository.findByName(name);
	}

	public ConfigTemplate findTemplateConfigByRol(User user,String name) {
		ConfigTemplate config = this.configTemplateRepository.findByName(name);
		List<Dependency> result = new ArrayList<>();
		config.getValue().forEach(x -> {
			if (hasRole(x.getRole(), user.getRoles())) {
				List<Form> form = new ArrayList<>();
				x.getForms().forEach(y -> {
					if (hasRole(y.getRole(), user.getRoles())) {
						form.add(y);
					}
				});
				x.setForms(form);
				result.add(x);
			}
		});
		config.setValue(result);
		return config;
	}

	private boolean hasRole(List<String> resource, List<Role> roles) {
		for (Role role : roles) {
			for (String res : resource) {
				if (res.equals(role.getRole())) {
					return true;
				}
			}
		}

		return false;
	}

}
