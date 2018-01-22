package co.com.caafi.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Repository;

import co.com.caafi.model.User;
import co.edu.udea.exception.OrgSistemasSecurityException;
import co.edu.udea.wsClient.OrgSistemasWebServiceClient;

@Repository
@PropertySource("classpath:udea.properties")
@Profile("pdn")
public class UserRepositoryImpl implements UserRepository {

	@Value("${TOKEN_PDN}")
	String tokenPDN;
	@Value("${CLAVE_PUBLICA}")
	String publicKey;
	@Value("${SERVICIO_VALIDAR_USUARIO}")
	String serviceName;

	public User getUser(String name, String password) {
		String doc;
		try {
			OrgSistemasWebServiceClient wsClient = new OrgSistemasWebServiceClient(publicKey);
			wsClient.addParam("usuario", name);
			wsClient.addParam("clave", password);
			doc = wsClient.obtenerString(serviceName, tokenPDN);
		} catch (OrgSistemasSecurityException ex) {
			return null;
		}
		User user = new User();
		user.setPass(password);
		user.setName(name);
		user.setUserName(name);
		user.setDocument(doc);

		return user;

	}

}
