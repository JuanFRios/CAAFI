package co.com.caafi.service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
	
	@Autowired
	public JavaMailSender emailSender;
	
	@Autowired
	public LogService logService;
	
	@Autowired
	private ConfigService configService;
	
	Logger logger = LoggerFactory.getLogger(EmailService.class);
	
	public void sendEmail(String to, String subject, String text) {
		MimeMessageHelper helper;
		MimeMessage message = emailSender.createMimeMessage();
		helper = new MimeMessageHelper(message);
		try {
			helper.setFrom((String) this.configService.findParamByName("EMAIL_SENDER").getValue());
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText("<html><body>" + text + "</body></html>", true);
			emailSender.send(message);
		} catch (MessagingException e) {
			logger.error("Error enviando Email a: " + to + ", error: " + e.getMessage(), e);
			logService.error("Error enviando Email a: " + to + ", error: " + e.getMessage() + ", thread: " 
					+ Thread.currentThread().getId(), message);
		}
	}

}
