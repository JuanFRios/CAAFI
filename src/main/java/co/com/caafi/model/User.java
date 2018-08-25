package co.com.caafi.model;

import java.util.List;

public class User {

	private String docType;
	private String document;
	private String name;
	private String lastName;
	private List<String> roles;
	private String password;
	private String username;

	public User(final User user) {
		this.password = user.password;
		this.name = user.name;
		this.username = user.username;
	}

	public User() {
	}
	
	public User(String username, String password) {
		this.username = username;
		this.password = password;
	}

	public String getDocType() {
		return docType;
	}

	public void setDocType(String docType) {
		this.docType = docType;
	}

	public String getDocument() {
		return document;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setDocument(String document) {
		this.document = document;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

}
