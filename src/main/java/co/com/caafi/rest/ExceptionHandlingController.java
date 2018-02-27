package co.com.caafi.rest;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice
public class ExceptionHandlingController {

	protected Logger logger;
	@Autowired
	public JavaMailSender emailSender;

	public ExceptionHandlingController() {

		logger = LoggerFactory.getLogger(getClass());
	}

	@ExceptionHandler(value = { Exception.class, RuntimeException.class })
	public ModelAndView defaultErrorHandler(HttpServletRequest request, Exception e) {
		ModelAndView mav = new ModelAndView("error");
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo("desarrolloingenieria10@udea.edu.co");
		message.setSubject("Error Caafi");
		message.setText("url: " + request.getRequestURL() + " Error: " + e.getMessage());
		emailSender.send(message);
		mav.addObject("datetime", new Date());
		mav.addObject("exception", e);
		mav.addObject("url", request.getRequestURL());
		return mav;
	}
}
