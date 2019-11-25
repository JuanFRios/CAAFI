package co.com.caafi.model;

import java.util.List;

public class Item {
	
	private String name;
	private String formalName;
	private String path;
	private boolean allDataAccess;
	private String evaluationDoc;
	private boolean noDependency;
	private List<String> role;
	private List<Item> subItems;
	private boolean noReport;
	private boolean adminReport;
	private boolean export;
	private String collection;
	private String serviceName;
	private String service;
	
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
	public boolean isAdminReport() {
		return adminReport;
	}
	public void setAdminReport(boolean adminReport) {
		this.adminReport = adminReport;
	}
	public String getFormalName() {
		return formalName;
	}
	public void setFormalName(String formalName) {
		this.formalName = formalName;
	}
	public boolean isExport() {
		return export;
	}
	public void setExport(boolean export) {
		this.export = export;
	}
	public String getCollection() {
		return collection;
	}
	public void setCollection(String collection) {
		this.collection = collection;
	}
	public String getServiceName() {
		return serviceName;
	}
	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}
	public String getService() {
		return service;
	}
	public void setService(String service) {
		this.service = service;
	}
}
