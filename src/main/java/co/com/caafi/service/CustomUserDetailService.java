package co.com.caafi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import co.com.caafi.model.CustomUserDetail;
import co.com.caafi.model.User;
import co.com.caafi.repository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService{

	@Autowired
	UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		System.out.println("entro a CustomUserDetailService");
		User user= userRepository.getUserByName(username);
		if (user == null) {
            throw new UsernameNotFoundException(username);
        }
		return new CustomUserDetail(user);
	}

}
