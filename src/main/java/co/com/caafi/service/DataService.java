package co.com.caafi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.template.Data;
import co.com.caafi.repository.DataRepository;

@Service
public class DataService {
	@Autowired
	private DataRepository dataRepository;

	public Data findById(String id) {
		return this.dataRepository.findById(id);
	}

	public List<Data> findAll() {
		return this.dataRepository.findAll();
	}

	public List<Data> findByTemplate(String template) {
		return this.dataRepository.findByTemplate(template);
	}
}
