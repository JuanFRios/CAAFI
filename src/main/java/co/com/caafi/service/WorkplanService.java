package co.com.caafi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.com.caafi.model.Workplan;
import co.com.caafi.repository.WorkplanRepository;

@Service
public class WorkplanService {
	
	@Autowired
	private WorkplanRepository workplanRepository;
	
	public List<Workplan> getAll() {
		return this.workplanRepository.findAll();
	}

}
