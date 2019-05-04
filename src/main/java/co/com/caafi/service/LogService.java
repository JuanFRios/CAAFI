package co.com.caafi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.Log;
import co.com.caafi.model.LogType;
import co.com.caafi.repository.LogRepository;

@Service
public class LogService {
    @Autowired
    LogRepository logRepository;
    
    public void info(String message, Object data) {
    		this.logRepository.insert(new Log(LogType.INFO, message, data));
    }
    
    public void debug(String message, Object data) {
		this.logRepository.insert(new Log(LogType.DEBUG, message, data));
    }
    
    public void error(String message, Object data) {
		this.logRepository.insert(new Log(LogType.ERROR, message, data));
    }
}
