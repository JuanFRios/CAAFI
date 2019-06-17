package co.com.caafi.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Config {
	@Id
	private String id;
	private String name;
	private String type;
	private Object value;
	private boolean publicResource;

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

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public boolean isPublicResource() {
		return publicResource;
	}

	public void setPublicResource(boolean publicResource) {
		this.publicResource = publicResource;
	}

}
