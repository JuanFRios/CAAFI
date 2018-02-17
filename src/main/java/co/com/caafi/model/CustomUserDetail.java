package co.com.caafi.model;

import java.util.Collection;
import java.util.HashSet;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserDetail extends User implements UserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CustomUserDetail(User user) {
		super(user);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		//retonar roles...
		HashSet<GrantedAuthority> authorities = new HashSet<>(1);
		authorities.add(new SimpleGrantedAuthority(super.getRole().name()));
		return authorities;
	}

	@Override
	public String getPassword() {
		return super.getPass();
	}

	@Override
	public String getUsername() {
		return super.getUserName();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}
