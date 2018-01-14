package co.com.caafi.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import co.com.caafi.service.CustomUserDetailService;

@Configuration
@EnableWebSecurity
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	private CustomUserDetailService userDetailsService;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// http.authorizeRequests().antMatchers("/",
		// "/home").permitAll().anyRequest().authenticated().and().formLogin()
		// .loginPage("/login").permitAll().and().logout().permitAll();

		http.authorizeRequests().antMatchers(
				"/rest/config/byname/**","/rest/template/byname/**").permitAll().antMatchers("/**").hasAuthority("admin").antMatchers("/user/**").hasAuthority("USER")
				.anyRequest().authenticated().and().formLogin().and().logout()
				.logoutRequestMatcher(new AntPathRequestMatcher("/logout")).logoutSuccessUrl("/login");
	}

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		System.out.println("Entro a userDetailsService");
		auth.userDetailsService(userDetailsService);
	}

	// Provisional
//	@Configuration
//	public class RestSecurityConfig extends WebSecurityConfigurerAdapter {
//		@Override
//		protected void configure(HttpSecurity http) throws Exception {
//			http.csrf().disable();
//		}
//	}
}
