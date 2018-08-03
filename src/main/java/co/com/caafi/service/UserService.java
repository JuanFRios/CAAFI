package co.com.caafi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.User;
import co.com.caafi.service.rest.UserRestService;

@Service
public class UserService {
	
	@Autowired
	private UserRestService userRestService;
	
	public User getUser(String username, String password) {	
		return userRestService.getByUsernameAndPassword(username, password);
	}

}
