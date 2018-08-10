package co.com.caafi.model;

public class Role {

	private String dependency;
	private String role;
	
	public Role(String dependency, String role) {
		this.dependency = dependency;
		this.role = role;
	}
	public String getDependency() {
		return dependency;
	}
	public void setDependency(String dependency) {
		this.dependency = dependency;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}

}
