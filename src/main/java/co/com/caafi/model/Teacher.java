package co.com.caafi.model;

public class Teacher {

	private String cedula;
	private int semestre;
	private String nombreProgramaOriginal;
    private String nombrePrograma;
    private int codigoPrograma;
    private int codigoMateria;
    private String nombreMateria;
    private int grupo;
    private String nombre;
    private String emailInstitucional;
    private String catedra;
    
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
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
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
	public String getEmailInstitucional() {
		return emailInstitucional;
	}
	public void setEmailInstitucional(String emailInstitucional) {
		this.emailInstitucional = emailInstitucional;
	}
	public String getCatedra() {
		return catedra;
	}
	public void setCatedra(String catedra) {
		this.catedra = catedra;
	}

}
