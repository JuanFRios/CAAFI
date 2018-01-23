package co.com.caafi.repository;

import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Repository;

import co.com.caafi.model.User;

@Repository
@PropertySource("classpath:udea.properties")
@Profile("dev")
public class DevUserRepositoryImpl implements UserRepository {

	public User getUser(String name, String password) {

		if (!password.equals("123456"))
			return null;
		User user = new User();
		user.setPass(password);
		user.setName(name);
		user.setUserName(name);
		user.setDocument("1063290384");

		return user;

	}

}
