package co.com.caafi.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.Config;
import co.com.caafi.model.ConfigTemplate;
import co.com.caafi.model.Dependence;
import co.com.caafi.model.User;
import co.com.caafi.repository.ConfigRepository;
import co.com.caafi.repository.ConfigTemplateRepository;

@Service
public class ConfigService {
	private static final String DEPENDENCIAS = "dependencias";
	@Autowired
	private ConfigRepository configRepository;
	@Autowired
	private ConfigTemplateRepository configTemplateRepository;

	public Config findByName(String name) {
		return this.configRepository.findByName(name);
	}

	public ConfigTemplate findTemplateConfigByRol(User user) {
		ConfigTemplate config = this.configTemplateRepository.findByName(DEPENDENCIAS);
		List<Dependence> result= new ArrayList<>();
		config.getValue().forEach(x -> {
			if (user.getRole().name().equals(x.getRole())) {
				result.add(x);
			}
		});
		config.setValue(result);
		return config;
	}

}
