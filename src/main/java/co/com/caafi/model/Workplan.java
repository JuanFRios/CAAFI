package co.com.caafi.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "workplan")
public class Workplan {
	
	@Id
	private ObjectId _id;
	
	@Field("id_plan")
	private int idPlan;
	
	@Field("documento")
	private int documento;
	
	@Field("nombre")
	private String nombre;
	
	@Field("clase_emp")
	private String tipoEmpleado;
	
	@Field("dedicacion")
	private int dedicacion;
	
	@Field("docencia")
	private int docencia;
	
	@Field("otras_doce")
	private int otrasDocencias;
	
	@Field("investigac")
	private int investigacion;
	
	@Field("otras_inve")
	private int otrasInvestigaciones;
	
	@Field("extension")
	private int extension;
	
	@Field("otras_exte")
	private int otrasExtensiones;
	
	@Field("admon")
	private int admon;
	
	@Field("otras")
	private int otras;
	
	@Field("id_estado")
	private int idEstado;
	
	@Field("codfac")
	private int codigoFacultad;
	
	@Field("ccosto_pro")
	private int idCentroCosto;
	
	@Field("ccosto")
	private String centroCosto;
	
	@Field("ccosto_desc")
	private String centroCostoDesc;
	
	@Field("stre_plan")
	private String semestre;
	
	@Field("dias_plan")
	private int diasPlan;

	public String get_id() {
		return _id.toHexString();
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}

	public int getIdPlan() {
		return idPlan;
	}

	public void setIdPlan(int idPlan) {
		this.idPlan = idPlan;
	}

	public int getDocumento() {
		return documento;
	}

	public void setDocumento(int documento) {
		this.documento = documento;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getTipoEmpleado() {
		return tipoEmpleado;
	}

	public void setTipoEmpleado(String tipoEmpleado) {
		this.tipoEmpleado = tipoEmpleado;
	}

	public int getDedicacion() {
		return dedicacion;
	}

	public void setDedicacion(int dedicacion) {
		this.dedicacion = dedicacion;
	}

	public int getDocencia() {
		return docencia;
	}

	public void setDocencia(int docencia) {
		this.docencia = docencia;
	}

	public int getOtrasDocencias() {
		return otrasDocencias;
	}

	public void setOtrasDocencias(int otrasDocencias) {
		this.otrasDocencias = otrasDocencias;
	}

	public int getInvestigacion() {
		return investigacion;
	}

	public void setInvestigacion(int investigacion) {
		this.investigacion = investigacion;
	}

	public int getOtrasInvestigaciones() {
		return otrasInvestigaciones;
	}

	public void setOtrasInvestigaciones(int otrasInvestigaciones) {
		this.otrasInvestigaciones = otrasInvestigaciones;
	}

	public int getExtension() {
		return extension;
	}

	public void setExtension(int extension) {
		this.extension = extension;
	}

	public int getOtrasExtensiones() {
		return otrasExtensiones;
	}

	public void setOtrasExtensiones(int otrasExtensiones) {
		this.otrasExtensiones = otrasExtensiones;
	}

	public int getAdmon() {
		return admon;
	}

	public void setAdmon(int admon) {
		this.admon = admon;
	}

	public int getOtras() {
		return otras;
	}

	public void setOtras(int otras) {
		this.otras = otras;
	}

	public int getIdEstado() {
		return idEstado;
	}

	public void setIdEstado(int idEstado) {
		this.idEstado = idEstado;
	}

	public int getCodigoFacultad() {
		return codigoFacultad;
	}

	public void setCodigoFacultad(int codigoFacultad) {
		this.codigoFacultad = codigoFacultad;
	}

	public int getIdCentroCosto() {
		return idCentroCosto;
	}

	public void setIdCentroCosto(int idCentroCosto) {
		this.idCentroCosto = idCentroCosto;
	}

	public String getCentroCosto() {
		return centroCosto;
	}

	public void setCentroCosto(String centroCosto) {
		this.centroCosto = centroCosto;
	}

	public String getCentroCostoDesc() {
		return centroCostoDesc;
	}

	public void setCentroCostoDesc(String centroCostoDesc) {
		this.centroCostoDesc = centroCostoDesc;
	}

	public String getSemestre() {
		return semestre;
	}

	public void setSemestre(String semestre) {
		this.semestre = semestre;
	}

	public int getDiasPlan() {
		return diasPlan;
	}

	public void setDiasPlan(int diasPlan) {
		this.diasPlan = diasPlan;
	}

}
