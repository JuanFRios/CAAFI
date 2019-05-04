package co.com.caafi.model;

import java.util.Date;

public class Log {
	private LogType type;
	private String message;
	private Date savedDate;
	private Object data;
	
	public Log(LogType type, String message, Object data) {
		this.type = type;
		this.message = message;
		this.savedDate = new Date();
		this.data = data;
	}
	
	public LogType getType() {
		return type;
	}
	public void setType(LogType type) {
		this.type = type;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Date getSavedDate() {
		return savedDate;
	}
	public void setSavedDate(Date savedDate) {
		this.savedDate = savedDate;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
}
