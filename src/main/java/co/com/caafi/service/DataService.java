package co.com.caafi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.User;
import co.com.caafi.model.template.FormData;
import co.com.caafi.repository.DataRepository;

@Service
public class DataService {
	@Autowired
	private DataRepository dataRepository;

	public FormData findById(int id) {
		return this.dataRepository.findById(id);
	}

	public List<FormData> findAll() {
		return this.dataRepository.findAll();
	}

	public List<FormData> findByTemplate(String template) {
		return this.dataRepository.findByTemplate(template);
	}

	public FormData save(FormData data, User user) {
		data.setCreator(user.getDocument());
		return this.dataRepository.save(data);
	}
}
