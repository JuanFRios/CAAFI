package co.com.caafi.model.field;

import java.util.List;

public class FieldArray {
	private Options templateOptions;
	private List<Field> fieldGroup;
	private String fieldGroupClassName;
	
	public Options getTemplateOptions() {
		return templateOptions;
	}
	public void setTemplateOptions(Options templateOptions) {
		this.templateOptions = templateOptions;
	}
	
	public List<Field> getFieldGroup() {
		return fieldGroup;
	}
	public void setFieldGroup(List<Field> fieldGroup) {
		this.fieldGroup = fieldGroup;
	}
	public String getFieldGroupClassName() {
		return fieldGroupClassName;
	}
	public void setFieldGroupClassName(String fieldGroupClassName) {
		this.fieldGroupClassName = fieldGroupClassName;
	}
}
