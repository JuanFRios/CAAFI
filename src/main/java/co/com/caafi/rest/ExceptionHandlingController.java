package co.com.caafi.rest;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import co.com.caafi.service.EmailService;

@ControllerAdvice
public class ExceptionHandlingController {

	protected Logger logger;
	
	@Autowired
	private EmailService emailService;

	public ExceptionHandlingController() {

		logger = LoggerFactory.getLogger(getClass());
		emailService = new EmailService();
	}

	@ExceptionHandler(value = { Exception.class, RuntimeException.class })
	public ModelAndView defaultErrorHandler(HttpServletRequest request, Exception e) {
		ModelAndView mav = new ModelAndView("error");
		emailService.sendEmail("desarrolloingenieria8@udea.edu.co", "Error Caafi", 
				"url: " + request.getRequestURL() + " Error: " + e.getMessage());
		mav.addObject("datetime", new Date());
		mav.addObject("exception", e);
		mav.addObject("url", request.getRequestURL());
		return mav;
	}
	
}
