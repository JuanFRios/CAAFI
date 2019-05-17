package co.com.caafi.model;

import org.springframework.data.annotation.Id;

public class Student {

	private String cedula;
	private int semestre;
    private String programa;
    private int codigoMateria;
    private String nombreMateria;
    private int grupo;    
    private String nombrePila;
    private String primApellido;
    private String sdoApellido;
    private String emailInstitu;
    private String email;
    
	public int getSemestre() {
		return semestre;
	}
	public void setSemestre(int semestre) {
		this.semestre = semestre;
	}
	public String getPrograma() {
		return programa;
	}
	public void setPrograma(String programa) {
		this.programa = programa;
	}
	public int getCodigoMateria() {
		return codigoMateria;
	}
	public void setCodigoMateria(int codigoMateria) {
		this.codigoMateria = codigoMateria;
	}
	public String getNombreMateria() {
		return nombreMateria;
	}
	public void setNombreMateria(String nombreMateria) {
		this.nombreMateria = nombreMateria;
	}
	public int getGrupo() {
		return grupo;
	}
	public void setGrupo(int grupo) {
		this.grupo = grupo;
	}
	public String getCedula() {
		return cedula;
	}
	public void setCedula(String cedula) {
		this.cedula = cedula;
	}
	public String getNombrePila() {
		return nombrePila;
	}
	public void setNombrePila(String nombrePila) {
		this.nombrePila = nombrePila;
	}
	public String getPrimApellido() {
		return primApellido;
	}
	public void setPrimApellido(String primApellido) {
		this.primApellido = primApellido;
	}
	public String getSdoApellido() {
		return sdoApellido;
	}
	public void setSdoApellido(String sdoApellido) {
		this.sdoApellido = sdoApellido;
	}
	public String getEmailInstitu() {
		return emailInstitu;
	}
	public void setEmailInstitu(String emailInstitu) {
		this.emailInstitu = emailInstitu;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

}
