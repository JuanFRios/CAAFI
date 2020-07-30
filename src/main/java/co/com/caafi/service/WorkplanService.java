package co.com.caafi.service;

import co.com.caafi.model.Workplan;
import co.com.caafi.repository.WorkplanRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class WorkplanService {

	@Autowired
	private WorkplanRepository workplanRepository;
	
	@Autowired
	private MongoTemplate mongoTemplate;

	public List<Workplan> get(String textFilter, String sortColumn, String sortDirection, 
			int pageIndex, int pageSize, String filters) {

		Order order = new Order(Sort.Direction.valueOf(sortDirection.toUpperCase()), sortColumn);
		Sort sort = Sort.by(order);

		BasicQuery query = new BasicQuery("{ $where: '(JSON.stringify(this).toLowerCase().indexOf( \"" + 
				textFilter + "\".toLowerCase() ) != -1);' }");

		ObjectMapper mapper = new ObjectMapper();
		Map<String, String> filtersMap = null;
		try {
			filtersMap = mapper.readValue(filters, Map.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
				
		if (filtersMap != null && !filtersMap.isEmpty()) {
			List<Criteria> criteria = new ArrayList<>();
			for (Map.Entry<String, String> entry : filtersMap.entrySet()) {
				if (entry.getValue() != null && !entry.getValue().isEmpty()) {
					criteria.add(getCriteria(entry.getKey(), entry.getValue()));
				}
			}
			if (!criteria.isEmpty()) {
				query.addCriteria(new Criteria().andOperator(criteria.stream().toArray(Criteria[]::new)));
			}
		}
		
		if (pageSize != -1) { // if pageSize is -1 gets all data
			query.with(PageRequest.of(pageIndex, pageSize, sort));
		}
		List<Workplan> result = mongoTemplate.find(query, Workplan.class, "workplan");
		return result;
	}
	
	private Criteria getCriteria(String key, String value) {
		String[] entryKey = key.split("-");
		String type = entryKey[0];
		String name = entryKey[1];
		switch(type) {
		case "te": // Text Equals
			return Criteria.where(name).is(value);
		case "tge": // Text Greater or Equals than
			return Criteria.where(name).gte(value);
		case "tle": // Text Less or Equals than
			return Criteria.where(name).lte(value);
		case "tc": // Text Contains
			return Criteria.where(name).regex(value);
		default:
			return null;
		}
	}

	public List<Workplan> get(String textFilter, String filters) {
		BasicQuery query = new BasicQuery("{ $where: '(JSON.stringify(this).toLowerCase().indexOf( \"" + 
				textFilter + "\".toLowerCase() ) != -1);' }");
		
		ObjectMapper mapper = new ObjectMapper();
		Map<String, String> filtersMap = null;
		try {
			filtersMap = mapper.readValue(filters, Map.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		if (filtersMap != null && !filtersMap.isEmpty()) {
			List<Criteria> criteria = new ArrayList<>();
			for (Map.Entry<String, String> entry : filtersMap.entrySet()) {
				if (entry.getValue() != null && !entry.getValue().isEmpty()) {
					criteria.add(getCriteria(entry.getKey(), entry.getValue()));
				}
			}
			if (!criteria.isEmpty()) {
				query.addCriteria(new Criteria().andOperator(criteria.stream().toArray(Criteria[]::new)));
			}
		}
		
		List<Workplan> result = mongoTemplate.find(query, Workplan.class, "workplan");
		return result;
	}

	public List<Workplan> getAll() {
		return this.workplanRepository.findAll();
	}

	public long count(String textFilter, String filters) {
		return get(textFilter, filters).size();
	}

}
