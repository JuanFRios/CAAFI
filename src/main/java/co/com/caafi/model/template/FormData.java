package co.com.caafi.model.template;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "data")
public class FormData {
	private String id;
	private String template;
	private String origin;
	private String creator;
	private Object data;
	private Date savedDate;

	public FormData() {
		this.savedDate = new Date();
	}
	
	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public Date getSavedDate() {
		return savedDate;
	}

	public void setSavedDate(Date savedDate) {
		this.savedDate = savedDate;
	}

}