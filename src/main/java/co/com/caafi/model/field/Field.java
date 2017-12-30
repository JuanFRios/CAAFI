package co.com.caafi.model.field;

import java.util.List;

import co.com.caafi.model.field.validation.Validation;
import co.com.caafi.model.field.validation.Validators;

public class Field {
	private String key;
	private String type;
	private String defaultValue;
	private Options templateOptions;
	private Validation validation;
	private Validators validators;
	
	private List<Field> group;

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public Options getTemplateOptions() {
		return templateOptions;
	}

	public void setTemplateOptions(Options templateOptions) {
		this.templateOptions = templateOptions;
	}

	public Validation getValidation() {
		return validation;
	}

	public void setValidation(Validation validation) {
		this.validation = validation;
	}

	public Validators getValidators() {
		return validators;
	}

	public void setValidators(Validators validators) {
		this.validators = validators;
	}

	public void setGroup(List<Field> group) {
		this.group = group;
	}
	
	public List<Field> getGroup() {
		return group;
	}
}
