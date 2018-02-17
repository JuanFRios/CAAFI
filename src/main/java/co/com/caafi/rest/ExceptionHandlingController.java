package co.com.caafi.rest;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice
public class ExceptionHandlingController {

	protected Logger logger;

	public ExceptionHandlingController() {

		logger = LoggerFactory.getLogger(getClass());
	}

	@ExceptionHandler(value = { Exception.class, RuntimeException.class })
	public ModelAndView defaultErrorHandler(HttpServletRequest request, Exception e) {
		ModelAndView mav = new ModelAndView("error");
		logger.error("**********************************"+e.getMessage());
		mav.addObject("datetime", new Date());
		mav.addObject("exception", e);
		mav.addObject("url", request.getRequestURL());
		return mav;
	}
}
