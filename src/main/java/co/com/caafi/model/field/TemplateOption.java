package co.com.caafi.model.field;

import java.util.List;
import java.util.regex.Pattern;

import co.com.caafi.model.types.select.Option;

public class TemplateOption {
	private String type;
	private String label;
	private String placeholder;
	private Boolean required;
	private List<Option> options; // for selects types
	private String optionsDB; // method name for load options fromdb
	private String btnText;
	private Pattern pattern;
	private Integer minLength;
	private Integer maxLength;
	private Integer min;
	private Integer max;
	private Boolean multiple;

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

	public Boolean isRequired() {
		return required;
	}

	public void setRequired(Boolean required) {
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

	public Integer getMinLength() {
		return minLength;
	}

	public void setMinLength(Integer minLength) {
		this.minLength = minLength;
	}

	public Integer getMaxLength() {
		return maxLength;
	}

	public void setMaxLength(Integer maxLength) {
		this.maxLength = maxLength;
	}

	public Integer getMin() {
		return min;
	}

	public void setMin(Integer min) {
		this.min = min;
	}

	public Integer getMax() {
		return max;
	}

	public void setMax(Integer max) {
		this.max = max;
	}

	public String getOptionsDB() {
		return optionsDB;
	}

	public void setOptionsDB(String optionsDB) {
		this.optionsDB = optionsDB;
	}

	public Boolean isMultiple() {
		return multiple;
	}

	public void setMultiple(Boolean multiple) {
		this.multiple = multiple;
	}

}
