package co.com.caafi.model.field;

import java.util.List;
import java.util.regex.Pattern;

import co.com.caafi.model.types.select.Option;

public class TemplateOption {
	private String type;
	private String label;
	private String placeholder;
	private boolean required;
	private List<Option> options; // for selects types
	private String optionsDB; // method name for load options fromdb
	private String btnText;
	private Pattern pattern;
	private int minLength;
	private int maxLength;
	private int min;
	private int max;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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

	public List<Option> getOptions() {
		return options;
	}

	public void setOptions(List<Option> options) {
		this.options = options;
	}

	public String getBtnText() {
		return btnText;
	}

	public void setBtnText(String btnText) {
		this.btnText = btnText;
	}

	public Pattern getPattern() {
		return pattern;
	}

	public void setPattern(Pattern pattern) {
		this.pattern = pattern;
	}

	public int getMinLength() {
		return minLength;
	}

	public void setMinLength(int minLength) {
		this.minLength = minLength;
	}

	public int getMaxLength() {
		return maxLength;
	}

	public void setMaxLength(int maxLength) {
		this.maxLength = maxLength;
	}

	public int getMin() {
		return min;
	}

	public void setMin(int min) {
		this.min = min;
	}

	public int getMax() {
		return max;
	}

	public void setMax(int max) {
		this.max = max;
	}

	public String getOptionsDB() {
		return optionsDB;
	}

	public void setOptionsDB(String optionsDB) {
		this.optionsDB = optionsDB;
	}

}
