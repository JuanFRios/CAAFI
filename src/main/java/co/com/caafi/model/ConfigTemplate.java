package co.com.caafi.model;


import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "config")
public class ConfigTemplate {
	@Id
	private String id;
	private String name;
	private List<Dependence> value;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Dependence> getValue() {
		return value;
	}

	public void setValue(List<Dependence> value) {
		this.value = value;
	}

}
