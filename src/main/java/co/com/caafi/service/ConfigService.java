package co.com.caafi.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	
	public Config findReportDependencies(String dependency) {
		Config reports =  this.configRepository.findByName("reportes");
		if(dependency != null) {
			return getDependencyFromReports((List<?>) reports.getValue(), dependency);
		}
		return getDependenciesFromReports((List<?>) reports.getValue());
	}

	private Config getDependenciesFromReports(List<?> reports) {
		Config reportDependencies = new Config();
		List<Map<String, Object>> value = new ArrayList<Map<String, Object>>();
		for(int i = 0; i < reports.size(); i++) {
			if (((Boolean) ((Map<?,?>)reports.get(i)).get("noReport")) == null || 
					!((Boolean) ((Map<?,?>)reports.get(i)).get("noReport"))) {
				Map<String, Object> reportItem = new HashMap<String, Object>();
				String nameReport = (String) ((Map<?,?>)reports.get(i)).get("name");
				reportItem.put("label", nameReport);
				reportItem.put("value", (String) ((Map<?,?>)reports.get(i)).get("path"));
				reportItem.put("path", (String) ((Map<?,?>)reports.get(i)).get("path"));
				List<?> forms = getSubItmes((List<?>) ((Map<?,?>)reports.get(i)).get("subItems"));
				reportItem.put("forms", forms);
				value.add(reportItem);
			}
		}
		reportDependencies.setValue(value);
		return reportDependencies;
	}
	
	private Config getDependencyFromReports(List<?> reports, String dependency) {
		Config reportDependencies = new Config();
		List<Map<String, Object>> value = new ArrayList<Map<String, Object>>();
		for(int i = 0; i < reports.size(); i++) {
			if (dependency != null && 
					dependency.equals((String) ((Map<?,?>)reports.get(i)).get("path"))) {
				Map<String, Object> reportItem = new HashMap<String, Object>();
				String nameReport = (String) ((Map<?,?>)reports.get(i)).get("name");
				reportItem.put("label", nameReport);
				reportItem.put("value", nameReport);
				reportItem.put("path", (String) ((Map<?,?>)reports.get(i)).get("path"));
				List<?> forms = getSubItmes((List<?>) ((Map<?,?>)reports.get(i)).get("subItems"));
				reportItem.put("forms", forms);
				value.add(reportItem);
				break;
			}
		}
		reportDependencies.setValue(value);
		return reportDependencies;
	}

	private List<Map<?,?>> getSubItmes(List<?> items) {
		List<Map<?,?>> subitems = new ArrayList<Map<?, ?>>();
		for(int i = 0; i < items.size(); i++) {
			if (((Boolean) ((Map<?,?>)items.get(i)).get("noReport")) == null || 
					!((Boolean) ((Map<?,?>)items.get(i)).get("noReport"))) {
				subitems.add((Map<?,?>)items.get(i));
			}
		}
		return subitems;
	}

	public Config findParamByName(String name) {
		return this.configRepository.findParamByName(name);
	}

	public Map<String, Object> getDependencyName(String dependency) {
		Config config = this.configRepository.findByNameWithoutSubitems("encuestas");
		List<Map<String, Object>> values = (List<Map<String, Object>>) config.getValue();
		for (Map<String, Object> value : values) {
			if (value.get("path").equals(dependency)) {
				return value;
			}
		}
		return null;
	}

}
