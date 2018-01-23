/**
 * 
 */
package co.com.caafi.config;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import co.com.caafi.model.User;
import co.com.caafi.repository.UserRepository;

/**
 * @author carlcaep
 *
 */
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

	@Autowired
	UserRepository userRepository;

	@Override
	public Authentication authenticate(Authentication authentication){
		String name = authentication.getName();
		String password = authentication.getCredentials().toString();
		User user = userRepository.getUser(name, password);
		if (user != null) {
			// use the credentials
			// and authenticate against the third-party system
			return new UsernamePasswordAuthenticationToken(user, password, new ArrayList<>());
		} else {
			return null;
		}
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}

}
