package co.com.caafi.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Repository;

import co.com.caafi.model.SIPEEmployee;
import co.com.caafi.model.User;
import co.edu.udea.exception.OrgSistemasSecurityException;
import co.edu.udea.wsClient.OrgSistemasWebServiceClient;

@Repository
@PropertySource("classpath:udea.properties")
@Profile("pdn")
public class UserRepositoryImpl implements UserRepository {

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
		try {

			wsClient = new OrgSistemasWebServiceClient(publicKey);
			wsClient.addParam("usuario", name);
			wsClient.addParam("clave", password);
			doc = wsClient.obtenerString(serviceName, token).trim();
		} catch (OrgSistemasSecurityException | Exception ex) {
			return null;
		}
		if (doc == null || "".equals(doc)) {
			return null;
		}
		user = new User();
		user.setPass(password);
		user.setName(name);
		user.setUserName(name);
		user.setDocument(doc);
		user.setRole(new ArrayList<String>(Arrays.asList("STUDENT")));
		try {
			List<SIPEEmployee> employeeList;
			wsClient = new OrgSistemasWebServiceClient();
			wsClient.addParam(paramSipeCC, doc);
			employeeList = wsClient.obtenerBean(serviceNameSipe, token, SIPEEmployee.class);
			int lastRecordIndex = employeeList.size() - 1;
			if (!employeeList.isEmpty() && employeeList.get(lastRecordIndex) != null) {
				SIPEEmployee employee = employeeList.get(lastRecordIndex);
				user.setRole(new ArrayList<String>(Arrays.asList("ADMIN")));
				user.setName(employee.getNombre());
				return user;
			}
		} catch (OrgSistemasSecurityException | Exception e) {
		}
		return user;

	}

}
