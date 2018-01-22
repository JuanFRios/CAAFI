package co.com.caafi.repository;

import co.com.caafi.model.User;

public interface UserRepository {

	User getUser(String name, String password);

}
