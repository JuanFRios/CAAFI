package co.com.caafi.model;

import java.util.List;

public class Item {
	
	private String name;
	private String path;
	private boolean allDataAccess;
	private String evaluationDoc;
	private boolean noDependency;
	private List<String> role;
	private List<Item> subItems;
	private boolean noReport;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public boolean isAllDataAccess() {
		return allDataAccess;
	}
	public void setAllDataAccess(boolean allDataAccess) {
		this.allDataAccess = allDataAccess;
	}
	public String getEvaluationDoc() {
		return evaluationDoc;
	}
	public void setEvaluationDoc(String evaluationDoc) {
		this.evaluationDoc = evaluationDoc;
	}
	public boolean isNoDependency() {
		return noDependency;
	}
	public void setNoDependency(boolean noDependency) {
		this.noDependency = noDependency;
	}
	public List<String> getRole() {
		return role;
	}
	public void setRole(List<String> role) {
		this.role = role;
	}
	public List<Item> getSubItems() {
		return subItems;
	}
	public void setSubItems(List<Item> subItems) {
		this.subItems = subItems;
	}
	public boolean isNoReport() {
		return noReport;
	}
	public void setNoReport(boolean noReport) {
		this.noReport = noReport;
	}
}
