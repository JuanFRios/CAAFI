package co.com.caafi.repository;

import org.springframework.stereotype.Repository;

import co.com.caafi.model.User;

@Repository
public class UserRepository {

	public User getUserByName(String name) {
System.out.println("Entro a validar usuario" + name);
		User user = new User();
		user.setPass("123456");
		user.setName(name);
		user.setUserName(name);

		return user;

	}
}
