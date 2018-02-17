package co.com.caafi.model;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * The Data Transfer Object for MARES student's entities.
 *
 * @author Diego Rendón
 */
@XmlRootElement
public class MARESStudent {
	// Variable names should be in spanish to match the Web Service response
	// from OrgSistemasWebServiceClient.
	private String nombre;
	private String apellidos;
	private String email;
	private String celular;
	private String telefono;
	private String direccion;
	private String codigoContinenteResidencia;
	private String nombreContinenteResidencia;
	private String codigoPaisResidencia;
	private String nombrePaisResidencia;
	private String codigoDepartamentoResidencia;
	private String nombreDepartamentoResidencia;
	private String codigoMunicipioResidencia;
	private String nombreMunicipioResidencia;
	private String codigoContinenteNacimiento;
	private String nombreContinenteNacimiento;
	private String codigoPaisNacimiento;
	private String nombrePaisNacimiento;
	private String codigoDepartamentoNacimiento;
	private String nombreDepartamentoNacimiento;
	private String codigoMunicipioNacimiento;
	private String nombreMunicipioNacimiento;
	private String codigoColegio;
	private String nombreColegio;
	private String estadoPersona;

	public String getApellidos() {
		return apellidos;
	}

	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}

	public String getCelular() {
		return celular;
	}

	public void setCelular(String celular) {
		this.celular = celular;
	}

	public String getCodigoColegio() {
		return codigoColegio;
	}

	public void setCodigoColegio(String codigoColegio) {
		this.codigoColegio = codigoColegio;
	}

	public String getCodigoContinenteNacimiento() {
		return codigoContinenteNacimiento;
	}

	public void setCodigoContinenteNacimiento(String codigoContinenteNacimiento) {
		this.codigoContinenteNacimiento = codigoContinenteNacimiento;
	}

	public String getCodigoContinenteResidencia() {
		return codigoContinenteResidencia;
	}

	public void setCodigoContinenteResidencia(String codigoContinenteResidencia) {
		this.codigoContinenteResidencia = codigoContinenteResidencia;
	}

	public String getCodigoDepartamentoNacimiento() {
		return codigoDepartamentoNacimiento;
	}

	public void setCodigoDepartamentoNacimiento(String codigoDepartamentoNacimiento) {
		this.codigoDepartamentoNacimiento = codigoDepartamentoNacimiento;
	}

	public String getCodigoDepartamentoResidencia() {
		return codigoDepartamentoResidencia;
	}

	public void setCodigoDepartamentoResidencia(String codigoDepartamentoResidencia) {
		this.codigoDepartamentoResidencia = codigoDepartamentoResidencia;
	}

	public String getCodigoMunicipioNacimiento() {
		return codigoMunicipioNacimiento;
	}

	public void setCodigoMunicipioNacimiento(String codigoMunicipioNacimiento) {
		this.codigoMunicipioNacimiento = codigoMunicipioNacimiento;
	}

	public String getCodigoMunicipioResidencia() {
		return codigoMunicipioResidencia;
	}

	public void setCodigoMunicipioResidencia(String codigoMunicipioResidencia) {
		this.codigoMunicipioResidencia = codigoMunicipioResidencia;
	}

	public String getCodigoPaisNacimiento() {
		return codigoPaisNacimiento;
	}

	public void setCodigoPaisNacimiento(String codigoPaisNacimiento) {
		this.codigoPaisNacimiento = codigoPaisNacimiento;
	}

	public String getCodigoPaisResidencia() {
		return codigoPaisResidencia;
	}

	public void setCodigoPaisResidencia(String codigoPaisResidencia) {
		this.codigoPaisResidencia = codigoPaisResidencia;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEstadoPersona() {
		return estadoPersona;
	}

	public void setEstadoPersona(String estadoPersona) {
		this.estadoPersona = estadoPersona;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getNombreColegio() {
		return nombreColegio;
	}

	public void setNombreColegio(String nombreColegio) {
		this.nombreColegio = nombreColegio;
	}

	public String getNombreContinenteNacimiento() {
		return nombreContinenteNacimiento;
	}

	public void setNombreContinenteNacimiento(String nombreContinenteNacimiento) {
		this.nombreContinenteNacimiento = nombreContinenteNacimiento;
	}

	public String getNombreContinenteResidencia() {
		return nombreContinenteResidencia;
	}

	public void setNombreContinenteResidencia(String nombreContinenteResidencia) {
		this.nombreContinenteResidencia = nombreContinenteResidencia;
	}

	public String getNombreDepartamentoNacimiento() {
		return nombreDepartamentoNacimiento;
	}

	public void setNombreDepartamentoNacimiento(String nombreDepartamentoNacimiento) {
		this.nombreDepartamentoNacimiento = nombreDepartamentoNacimiento;
	}

	public String getNombreDepartamentoResidencia() {
		return nombreDepartamentoResidencia;
	}

	public void setNombreDepartamentoResidencia(String nombreDepartamentoResidencia) {
		this.nombreDepartamentoResidencia = nombreDepartamentoResidencia;
	}

	public String getNombreMunicipioNacimiento() {
		return nombreMunicipioNacimiento;
	}

	public void setNombreMunicipioNacimiento(String nombreMunicipioNacimiento) {
		this.nombreMunicipioNacimiento = nombreMunicipioNacimiento;
	}

	public String getNombreMunicipioResidencia() {
		return nombreMunicipioResidencia;
	}

	public void setNombreMunicipioResidencia(String nombreMunicipioResidencia) {
		this.nombreMunicipioResidencia = nombreMunicipioResidencia;
	}

	public String getNombrePaisNacimiento() {
		return nombrePaisNacimiento;
	}

	public void setNombrePaisNacimiento(String nombrePaisNacimiento) {
		this.nombrePaisNacimiento = nombrePaisNacimiento;
	}

	public String getNombrePaisResidencia() {
		return nombrePaisResidencia;
	}

	public void setNombrePaisResidencia(String nombrePaisResidencia) {
		this.nombrePaisResidencia = nombrePaisResidencia;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}
}