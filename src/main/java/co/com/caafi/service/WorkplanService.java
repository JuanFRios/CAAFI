package co.com.caafi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import co.com.caafi.model.Workplan;
import co.com.caafi.repository.WorkplanRepository;

@Service
public class WorkplanService {

	@Autowired
	private WorkplanRepository workplanRepository;

	public List<Workplan> get(String filter, String sortColumn, String sortDirection, int pageIndex, int pageSize) {
		return this.workplanRepository.customFindAll(filter, new PageRequest(pageIndex, pageSize,
				new Sort(Sort.Direction.valueOf(sortDirection.toUpperCase()), sortColumn)));
	}

	public List<Workplan> getAll() {
		return this.workplanRepository.findAll();
	}

	public long countAll() {
		return getAll().size();
	}

}
