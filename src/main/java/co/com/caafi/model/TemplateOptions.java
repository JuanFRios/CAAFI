package co.com.caafi.model;

public class TemplateOptions {
	private String label;
	private String placeholder;
	private boolean required;
	
	public TemplateOptions(String label, String placeholder, boolean required) {
		super();
		this.label = label;
		this.placeholder = placeholder;
		this.required = required;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getPlaceholder() {
		return placeholder;
	}

	public void setPlaceholder(String placeholder) {
		this.placeholder = placeholder;
	}

	public boolean isRequired() {
		return required;
	}

	public void setRequired(boolean required) {
		this.required = required;
	}
	
}
