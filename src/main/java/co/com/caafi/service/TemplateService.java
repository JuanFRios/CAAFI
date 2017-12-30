package co.com.caafi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.template.Template;
import co.com.caafi.repository.TemplateRepository;

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
}
