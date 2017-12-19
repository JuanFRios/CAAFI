package co.com.caafi.service;

import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.Field;
import co.com.caafi.model.Template;
import co.com.caafi.repository.TemplateRepository;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class TemplateService {
	@Autowired
	private TemplateRepository templateRepository;

	public Template findByName(String name) {
		return this.templateRepository.findByName(name).get(0);

	}

	public List<Template> findAll() {
		return this.templateRepository.findAll();
	}

	public boolean create(Integer num) {
		Template def= this.findByName("Produccion de articulos"); 
		
		for (int i = 0; i < num; i++) {
			def.setId(null);
			for (Field iterable_element : def.getFields()) {
				if(iterable_element.getType().equals("group")){
					for (Field iterable_element2 : iterable_element.getGroup()) {
						setValueField(iterable_element2);
					}
					
				}else{
					setValueField(iterable_element);
				}
			}
			this.templateRepository.save(def); 
		}
		return true;
	}
	
	public String createRandomCode(int codeLength, String id) {   
	    List<Character> temp = id.chars()
	            .mapToObj(i -> (char)i)
	            .collect(Collectors.toList());
	    Collections.shuffle(temp, new SecureRandom());
	    return temp.stream()
	            .map(Object::toString)
	            .limit(codeLength)
	            .collect(Collectors.joining());
	}
	
	private void setValueField(Field field) {
		switch(field.getType()) {
		case "text":
			field.setValue(createRandomCode(12, "ABCDEFGHIJKLMNOPQRSTUVWXYZ"));
			break;
		case "number":
			field.setIntValue(ThreadLocalRandom.current().nextInt(1900, 2017 + 1));
			break;
		case "select":
			field.setValue(ThreadLocalRandom.current().nextInt(0, 1 + 1) == 0 ? "A" : "B");
		}
	}
}
