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
@Profile("dev")
public class DevUserRepositoryImpl implements UserRepository{


	public User getUser(String name, String password) {
		User user = new User();
		user.setPass(password);
		user.setName(name);
		user.setUserName(name);
		user.setDocument("123456");

		return user;

	}

}
