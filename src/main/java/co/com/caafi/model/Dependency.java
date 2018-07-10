package co.com.caafi.model;

import java.util.List;

public class Dependency {

	private String name;
	private List<String> role;
	private List<Form> forms;
	private List<Form> formsReport;
	private boolean evaluationItem;
	private String evaluationDoc;
	private boolean noDependency;

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

}
