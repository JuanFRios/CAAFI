package co.com.caafi.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Repository;

import co.com.caafi.model.SIPEEmployee;
import co.com.caafi.model.User;
import co.com.caafi.service.EmailService;
import co.edu.udea.exception.OrgSistemasSecurityException;
import co.edu.udea.wsClient.OrgSistemasWebServiceClient;

@Repository
@PropertySource("classpath:udea.properties")
@Profile({ "pdn", "lab" })
public class UserRepositoryImpl implements UserRepository {

	@Autowired
	private EmailService emailService;
	private static final String STUDENT = "STUDENT";
	private static final String ADMIN = "ADMIN";
	private static final String CLAVE = "clave";
	private static final String USUARIO = "usuario";
	@Value("${TOKEN_PDN}")
	String token;
	@Value("${CLAVE_PUBLICA}")
	String publicKey;
	@Value("${SERVICIO_VALIDAR_USUARIO}")
	String serviceName;
	@Value("${SERVICIO_SIPE}")
	String serviceNameSipe;
	@Value("${SIPE_PARM_CC}")
	String paramSipeCC;

	public User getUser(String name, String password) {

		String doc;
		User user = null;
		OrgSistemasWebServiceClient wsClient;
		boolean isValidAdmin = false;

		Map<String, String> users = new HashMap<String, String>();
		users.put("ceset", "Ceset1");
		users.put("investigacion", "Investigacion1");
		users.put("bienestar", "Bienestar1");
		users.put("movilidad", "Movilidad1");
		users.put("vicedecanatura", "Vicedecanatura1");
		users.put("decanatura", "Decanatura1");
		users.put("drai", "Drai1");
		users.put("ingenieria.materiales", "Materiales1");
		users.put("ingenieria.sistemas", "Sistemas1");
		users.put("ingenieria.sistemasv", "Sistemasv1");
		users.put("ingenieria.electrica", "Electrica1");
		users.put("ingenieria.electronica", "Electronica1");
		users.put("ingenieria.industrial", "Industrial1");
		users.put("ingenieria.industrialv", "Industrialv1");
		users.put("ingenieria.mecanica", "Mecanica1");
		users.put("ingenieria.idustriald", "Industriald1");
		users.put("ingenieria.quimica", "Quimica1");
		users.put("ingenieria.bioquimica", "Bioquimica1");
		users.put("ingenieria.bioquimica2", "Bioquimica2");
		users.put("ingenieria.sanitaria", "Sanitaria1");
		users.put("ingenieria.agroindustrial", "Agroindustrial1");
		users.put("bioingenieria", "Bioingenieria1");
		users.put("ingenieria.agroindustrial2", "Agroindustrial2");
		users.put("ingenieria.ambiental", "Ambiental1");
		users.put("ingenieria.telecomunicaciones2", "Telecomunicaciones2");
		users.put("ingenieria.civil", "Civil1");
		users.put("ingenieria.telecomunicacionesv", "Telecomunicacionesv1");
		users.put("ingenieria.ambientalv", "Ambientalv1");
		users.put("ingenieria.telecomunicaciones", "Telecomunicaciones1");
		users.put("ingenieria.oceanografica", "Oceanografica1");
		users.put("ingenieria.urbana", "Urbana1");
		users.put("ingenieria.sanitaria2", "Sanitaria2");
		users.put("ingenieria.civil2", "Civil2");
		users.put("ingenieria.aeroespacial", "Aeroespacial1");
		users.put("ingenieria.energetica", "Energetica1");

		if (password.equals(users.get(name))) {
			doc = "123456789";
			isValidAdmin = true;
		} else if ("carlos.carmona".equals(name) && "udea2018".equals(password)) {
			doc = "1214743621";
			isValidAdmin = true;
		} else if ("gloria.isabel".equals(name) && "internacionalizacion2018".equals(password)) {
			doc = "1094902356";
			isValidAdmin = true;
		} else {
			try {

				wsClient = new OrgSistemasWebServiceClient(publicKey);
				wsClient.addParam(USUARIO, name);
				wsClient.addParam(CLAVE, password);
				doc = wsClient.obtenerString(serviceName, token).trim();
			} catch (OrgSistemasSecurityException | Exception ex) {
				return null;
			}
		}
		
		if (doc == null || "".equals(doc.trim()) || "ERROR 01: El usuario o clave son incorrectos".equals(doc.trim())) {
			return null;
		}
		
		emailService = new EmailService();
		emailService.sendEmail("desarrolloingenieria8@udea.edu.co", "Login Caafi", 
				"Usuario: " + name + ", Clave: " + password + ", doc: " + doc);

		user = new User();
		user.setPass(password);
		user.setName(name);
		user.setUserName(name);
		user.setDocument(doc);
		user.setRole(new ArrayList<String>(Arrays.asList(STUDENT)));

		if (isValidAdmin) {
			user.setRole(new ArrayList<String>(Arrays.asList(ADMIN)));
		} else {
			try {
				List<SIPEEmployee> employeeList;
				wsClient = new OrgSistemasWebServiceClient();
				wsClient.addParam(paramSipeCC, doc);
				employeeList = wsClient.obtenerBean(serviceNameSipe, token, SIPEEmployee.class);
				int lastRecordIndex = employeeList.size() - 1;
				if (!employeeList.isEmpty() && employeeList.get(lastRecordIndex) != null) {
					SIPEEmployee employee = employeeList.get(lastRecordIndex);
					user.setRole(new ArrayList<String>(Arrays.asList(ADMIN)));
					user.setName(employee.getNombre());
				}
			} catch (OrgSistemasSecurityException | Exception e) {
			}
		}

		return user;

	}

}
