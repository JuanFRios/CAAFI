package co.com.caafi.model;

public class Student {

	private String cedula;
	private int semestre;
	private String nombreProgramaOriginal;
    private String nombrePrograma;
    private int codigoPrograma;
    private int codigoMateria;
    private String nombreMateria;
    private int grupo;    
    private String nombrePila;
    private String primerApellido;
    private String segundoApellido;
    private String emailInstitucional;
    private String email;
    
	public int getSemestre() {
		return semestre;
	}
	public void setSemestre(int semestre) {
		this.semestre = semestre;
	}
	public String getNombrePrograma() {
		return nombrePrograma;
	}
	public void setNombrePrograma(String nombrePrograma) {
		this.nombrePrograma = nombrePrograma;
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getCodigoPrograma() {
		return codigoPrograma;
	}
	public void setCodigoPrograma(int codigoPrograma) {
		this.codigoPrograma = codigoPrograma;
	}
	public String getNombreProgramaOriginal() {
		return nombreProgramaOriginal;
	}
	public void setNombreProgramaOriginal(String nombreProgramaOriginal) {
		this.nombreProgramaOriginal = nombreProgramaOriginal;
	}
	public String getPrimerApellido() {
		return primerApellido;
	}
	public void setPrimerApellido(String primerApellido) {
		this.primerApellido = primerApellido;
	}
	public String getEmailInstitucional() {
		return emailInstitucional;
	}
	public void setEmailInstitucional(String emailInstitucional) {
		this.emailInstitucional = emailInstitucional;
	}
	public String getSegundoApellido() {
		return segundoApellido;
	}
	public void setSegundoApellido(String segundoApellido) {
		this.segundoApellido = segundoApellido;
	}

}
