/**
 * 
 */
package co.com.caafi.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import co.com.caafi.model.Role;
import co.com.caafi.model.User;
import co.com.caafi.service.UserService;

/**
 * @author carlcaep
 *
 */
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

	@Autowired
	UserService userService;

	@Override
	public Authentication authenticate(Authentication authentication) {
		String name = authentication.getName();
		String password = authentication.getCredentials().toString();
		User user = userService.getUser(name, password);
		if (user != null) {
			// use the credentials
			// and authenticate against the third-party system
			return new UsernamePasswordAuthenticationToken(user, password, transformRole(user.getRoles()));
		} else {
			return null;
		}
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}

	private List<GrantedAuthority> transformRole(List<Role> list) {
		List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
		list.forEach(x -> authorities.add(new SimpleGrantedAuthority(x.getRole())));
		return authorities;

	}
}
