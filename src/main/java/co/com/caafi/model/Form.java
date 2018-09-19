package co.com.caafi.model;

import java.util.List;

public class Form {
	private String name;
	private String path;
	private List<String> role;
	private String template;
	private Object config;
	private boolean allDataAccess;
	private List<Form> subItems;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Object getConfig() {
		return config;
	}

	public void setConfig(Object config) {
		this.config = config;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

	public List<String> getRole() {
		return role;
	}

	public void setRole(List<String> role) {
		this.role = role;
	}

	public boolean isAllDataAccess() {
		return allDataAccess;
	}

	public void setAllDataAccess(boolean allDataAccess) {
		this.allDataAccess = allDataAccess;
	}

	public List<Form> getSubItems() {
		return subItems;
	}

	public void setSubItems(List<Form> subItems) {
		this.subItems = subItems;
	}

}
