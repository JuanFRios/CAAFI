package co.com.caafi.rest;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import co.com.caafi.service.LogService;

@ControllerAdvice
public class ExceptionHandlingController {

	protected Logger logger;
	
	@Autowired
	private LogService logService;

	public ExceptionHandlingController() {
		logger = LoggerFactory.getLogger(getClass());
	}

	@ExceptionHandler(value = { Exception.class, RuntimeException.class })
	public ModelAndView defaultErrorHandler(HttpServletRequest request, Exception e) {
		ModelAndView mav = new ModelAndView("error");
		this.logService.error("Error Report in URL: " + request.getRequestURL() 
		 + ", error: " + e.getMessage(), e);
		mav.addObject("datetime", new Date());
		mav.addObject("exception", e);
		mav.addObject("url", request.getRequestURL());
		return mav;
	}
	
}
