package co.com.caafi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.Config;
import co.com.caafi.repository.ConfigRepository;

@Service
public class ConfigService {
	@Autowired
	private ConfigRepository configRepository;

	public Config findByName(String name) {
		return this.configRepository.findByName(name);
	}

}
