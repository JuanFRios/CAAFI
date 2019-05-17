package co.com.caafi.model.template;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Template {

	@Id
	private String id;
	private String name;
	private Integer version;
	private String description;
	private List<Map<String, Object>> fields;
	private List<Map<String, Object>> report;
	private List<Map<String, Object>> config;
	private Map<String, Object> variables;
	private Date startDate;
	private Date endDate;
	private String role;
	private List<String> table;
	private boolean isPublic;
	private String origin;

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

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public List<Map<String, Object>> getFields() {
		return fields;
	}

	public void setFields(List<Map<String, Object>> fields) {
		this.fields = fields;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Map<String, Object> getVariables() {
		return variables;
	}

	public void setVariables(Map<String, Object> variables) {
		this.variables = variables;
	}

	public List<String> getTable() {
		return table;
	}

	public void setTable(List<String> table) {
		this.table = table;
	}

	public List<Map<String, Object>> getReport() {
		return report;
	}

	public void setReport(List<Map<String, Object>> report) {
		this.report = report;
	}

	public List<Map<String, Object>> getConfig() {
		return config;
	}

	public void setConfig(List<Map<String, Object>> config) {
		this.config = config;
	}

	public boolean isPublic() {
		return isPublic;
	}

	public void setPublic(boolean isPublic) {
		this.isPublic = isPublic;
	}

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

}
