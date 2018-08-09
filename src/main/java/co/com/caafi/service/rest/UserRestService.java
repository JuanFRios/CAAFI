package co.com.caafi.service.rest;

import org.springframework.http.HttpEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import co.com.caafi.model.User;

@Service
public class UserRestService extends RestService {
	
	public User getByUsernameAndPassword(String username, String password) {
		int timeout = Integer.parseInt(env.getProperty("udea.auth-api.api.by-credentials.timeout"));
		ClientHttpRequestFactory requestFactory = getClientHttpRequestFactory(timeout);
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		 
		HttpEntity<User> request = new HttpEntity<>(new User(username, password));
		User user = restTemplate.postForObject(env.getProperty("udea.auth-api.base-url") + 
				env.getProperty("udea.auth-api.api.by-credentials.path"), request, User.class);
		return user;

	}

}
