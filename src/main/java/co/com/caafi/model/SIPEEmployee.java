package co.com.caafi.model;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * The Data Transfer Object for SIPE employee's entities.
 *
 * @author Diego Rendón
 */
@XmlRootElement
public class SIPEEmployee {
	// Variable names should be in spanish to match the Web Service response
	// from OrgSistemasWebServiceClient.
	private String esAcademico;
	private String esRector;
	private String tipoIdentificacion;
	private String numeroIdentificacion;
	private String nombres;
	private String primerApellido;
	private String segundoApellido;
	private String nombre;
	private String centroCosto;
	private String cargo;
	private String celular;
	private String telefono;
	private String email;
	private String direccion;

	public String getEsAcademico() {
		return esAcademico;
	}

	public void setEsAcademico(String esAcademico) {
		this.esAcademico = esAcademico;
	}

	public String getEsRector() {
		return esRector;
	}

	public void setEsRector(String esRector) {
		this.esRector = esRector;
	}

	public String getTipoIdentificacion() {
		return tipoIdentificacion;
	}

	public void setTipoIdentificacion(String tipoIdentificacion) {
		this.tipoIdentificacion = tipoIdentificacion;
	}

	public String getNumeroIdentificacion() {
		return numeroIdentificacion;
	}

	public void setNumeroIdentificacion(String numeroIdentificacion) {
		this.numeroIdentificacion = numeroIdentificacion;
	}

	public String getNombres() {
		return nombres;
	}

	public void setNombres(String nombres) {
		this.nombres = nombres;
	}

	public String getPrimerApellido() {
		return primerApellido;
	}

	public void setPrimerApellido(String primerApellido) {
		this.primerApellido = primerApellido;
	}

	public String getSegundoApellido() {
		return segundoApellido;
	}

	public void setSegundoApellido(String segundoApellido) {
		this.segundoApellido = segundoApellido;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getCentroCosto() {
		return centroCosto;
	}

	public void setCentroCosto(String centroCosto) {
		this.centroCosto = centroCosto;
	}

	public String getCargo() {
		return cargo;
	}

	public void setCargo(String cargo) {
		this.cargo = cargo;
	}

	public String getCelular() {
		return celular;
	}

	public void setCelular(String celular) {
		this.celular = celular;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
}