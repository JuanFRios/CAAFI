package co.com.caafi.model;

import java.util.List;

public class Dependency {

	private String name;
	private List<String> role;
	private List<Form> forms;
	private List<Form> formsReport;
	private List<Form> polls;
	private boolean evaluationItem;
	private String evaluationDoc;
	private boolean noDependency;
	private boolean noReport;
	private boolean adminReport;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<String> getRole() {
		return role;
	}

	public void setRole(List<String> role) {
		this.role = role;
	}

	public List<Form> getForms() {
		return forms;
	}

	public void setForms(List<Form> forms) {
		this.forms = forms;
	}

	public List<Form> getFormsReport() {
		return formsReport;
	}

	public void setFormsReport(List<Form> formsReport) {
		this.formsReport = formsReport;
	}

	public boolean isEvaluationItem() {
		return evaluationItem;
	}

	public void setEvaluationItem(boolean evaluationItem) {
		this.evaluationItem = evaluationItem;
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

	public List<Form> getPolls() {
		return polls;
	}

	public void setPolls(List<Form> polls) {
		this.polls = polls;
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

}
