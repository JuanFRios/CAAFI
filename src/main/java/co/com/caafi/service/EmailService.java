package co.com.caafi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Component("caafiMailSender")
public class EmailService {
	
	@Autowired
	public JavaMailSender emailSender;
	
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	public void sendEmail(String to, String subject, String text) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject(subject);
		message.setText(text);
		
		logger.info("Sending...");
		
		emailSender.send(message);
		
		logger.info("Done!");
	}

}
