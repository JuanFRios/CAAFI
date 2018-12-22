package co.com.caafi.rest;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import co.com.caafi.model.StringResponse;

@RestController
@RequestMapping(path = "rest/account")
public class Login {

	@CrossOrigin
	@RequestMapping(path ="/login", method = RequestMethod.GET)
	public Map<String, Object> user(Principal principal,HttpSession session) {
		Map<String, Object> res = new HashMap<>(); 
		res.put("token", session.getId()); 
		res.put("user", principal); 
		return res;
	}
	
	@CrossOrigin
	@RequestMapping(path ="/check", method = RequestMethod.GET)
	public StringResponse checkUser(HttpSession session) {
		return new StringResponse(session.getId());
	}
	
}
