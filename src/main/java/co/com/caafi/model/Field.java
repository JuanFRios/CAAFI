package co.com.caafi.model;

import java.util.List;

public class Field {
	private String name;
	private String type;
	private String value;
	private String label;
	private String required;
	private Integer min;
	private Integer max;
	private Integer minLength;
	private Integer maxLength;
	private List<Field> group;
	private Integer requiredNum;

	public List<Field> getGroup() {
		return group;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setGroup(List<Field> group) {
		this.group = group;
	}

	public Integer getRequiredNum() {
		return requiredNum;
	}

	public void setRequiredNum(Integer requiredNum) {
		this.requiredNum = requiredNum;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getRequired() {
		return required;
	}

	public void setRequired(String required) {
		this.required = required;
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

}
