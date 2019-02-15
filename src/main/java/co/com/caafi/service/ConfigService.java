package co.com.caafi.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.Config;
import co.com.caafi.model.ConfigTemplate;
import co.com.caafi.model.Dependency;
import co.com.caafi.model.Form;
import co.com.caafi.model.Item;
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
	
	public Config findPublicConfigByName(String name) {
		return this.configRepository.findByNameAndIsPublic(name, true);
	}

	public ConfigTemplate findTemplateConfigByRol(User user,String name) {
		ConfigTemplate config = this.configTemplateRepository.findByName(name);
		List<Item> items = getItemsByRole(config.getValue(), user);
		config.setValue(items);
		return config;
	}

	private List<Item> getItemsByRole(List<Item> items, User user) {
		List<Item> itemsByRole = new ArrayList<>();
		for(Item item : items) {
			if(hasRole(item.getRole(), user.getRoles())) {
				item.setSubItems(item.getSubItems() == null ? null : getItemsByRole(item.getSubItems(), user));
				itemsByRole.add(item);
			}
		}
		return itemsByRole;
	}

	private boolean hasRole(List<String> resource, List<String> roles) {
		for (String role : roles) {
			for (String res : resource) {
				if (res.equals(role)) {
					return true;
				}
			}
		}

		return false;
	}

}
