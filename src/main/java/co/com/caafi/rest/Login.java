package co.com.caafi.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/login")
public class Login {

	@RequestMapping(path = "/all", method = RequestMethod.GET)
	public String get() {
		return "acceso";
	}

}
