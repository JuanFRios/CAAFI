package co.com.caafi.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.wnameless.json.flattener.JsonFlattener;

import co.com.caafi.model.User;
import co.com.caafi.model.template.FormData;
import co.com.caafi.repository.DataRepository;

@Service
public class DataService {
    @Autowired
    DataRepository dataRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    public FormData findById(String id) {
        return this.dataRepository.findById(id);
    }
    
    public void deleteById(String id, User user) {
    		FormData data = this.dataRepository.findById(id);
    		data.setDeleted(true);
    		data.setEliminator(user.getDocument());		
        this.dataRepository.save(data);
    }

    public List<FormData> findAll() {
        return this.dataRepository.findAll();
    }

    /*
    public List<FormData> findByTemplate(String template, String dependency) {
    	
    		/*
    		Query query = new Query();
    		query.addCriteria(Criteria.where("template").is(template));
        return this.mongoTemplate.find(query, FormData.class);
        
        
    		return this.dataRepository.findCustomByTemplate(template, dependency, new Sort(Sort.Direction.DESC, "savedDate"));
        
    		//return this.dataRepository.findByTemplateAndOriginAndDeleted(template, dependency, false, new Sort(Sort.Direction.DESC, "savedDate"));

    }*/

    public List<Object> findByJson(String template, String fields) {
        BasicQuery query = new BasicQuery(template, JsonFlattener.flatten(fields));
        return this.mongoTemplate.find(query, Object.class, "data");
    }

    public FormData save(FormData data, User user) {
        data.setCreator(user.getDocument());
        return this.dataRepository.save(data);
    }

	public List<FormData> findByTemplateAndDependency(String template, String dependency, String filter,
			String sortColumn, String sortOrder, int pageNumber, int pageSize, String filters) {

		String column = "savedDate";
		if(sortColumn != null && !sortColumn.isEmpty()) {
			column = "data." + sortColumn;
		}
		
		Direction direction = Sort.Direction.DESC;
		if(sortOrder != null && !sortOrder.isEmpty() && "asc".equals(sortOrder)) {			
			direction = Sort.Direction.ASC;
		} else if(sortOrder.isEmpty()) {
			column = "savedDate";
		}
		
		Order order = new Order(direction, column);
		Sort sort = new Sort(order);
		
		String filterWhere = "true";
		if(filter != null && !filter.isEmpty()) {
			filterWhere = "JSON.stringify(this.data).toLowerCase().indexOf( \\\"" + filter + "\\\".toLowerCase())!=-1";
		}
		
		String filtersWhere = "true";
		if(filters != null && !filters.isEmpty() && !"{}".equals(filters)) {
			try {
				HashMap<String,Object> result = new ObjectMapper().readValue(filters, HashMap.class);
				filtersWhere = "?1 && ?2 && ?3";
				for (Entry<String, Object> entry : result.entrySet()) {
					if(entry.getKey().equals("semestreInicio")) {
						if(entry.getValue() != null && !((String) entry.getValue()).isEmpty()) {
							filtersWhere = filtersWhere.replace("?1", "this.data.semestre >= \\\"" + (String) entry.getValue() + "\\\"");
						} else {
							filtersWhere = filtersWhere.replace("?1", "true");
						}
					} else if(entry.getKey().equals("semestreFin")) {
						if(entry.getValue() != null && !((String) entry.getValue()).isEmpty()) {
							filtersWhere = filtersWhere.replace("?2", "this.data.semestre <= \\\"" + (String) entry.getValue() + "\\\"");
						} else {
							filtersWhere = filtersWhere.replace("?2", "true");
						}
					} else if(entry.getKey().equals("grupoInvestigacion")) {
						if(entry.getValue() != null && !((String) entry.getValue()).isEmpty()) {
							filtersWhere = filtersWhere.replace("?3", "JSON.stringify(this.data).toLowerCase().indexOf( \\\"" + (String) entry.getValue() + "\\\".toLowerCase())!=-1");
						} else {
							filtersWhere = filtersWhere.replace("?3", "true");
						}
					}
			    }
				filtersWhere = filtersWhere.replace("?1", "true");
				filtersWhere = filtersWhere.replace("?2", "true");
				filtersWhere = filtersWhere.replace("?3", "true");
			} catch (Exception e) {
				filtersWhere = "true";
			}
		}
		
		if(pageSize == -1) {
			return this.dataRepository.findCustomByTemplate(template, dependency, filterWhere, 
					filtersWhere, sort);
		} else {
			return this.dataRepository.findCustomByTemplate(template, dependency, filterWhere,
					filtersWhere, new PageRequest(pageNumber, pageSize, sort));
		}
	}

	public FormData count(String template, String dependency, String filter, String filters) {
		FormData data = new FormData();
		String filterWhere = "true";
		if(filter != null && !filter.isEmpty()) {
			filterWhere = "JSON.stringify(this.data).toLowerCase().indexOf( \\\"" + filter + "\\\".toLowerCase())!=-1";
		}
		String filtersWhere = "true";
		if(filters != null && !filters.isEmpty() && !"{}".equals(filters)) {
			try {
				HashMap<String,Object> result = new ObjectMapper().readValue(filters, HashMap.class);
				filtersWhere = "?1 && ?2 && ?3";
				for (Entry<String, Object> entry : result.entrySet()) {
					if(entry.getKey().equals("semestreInicio")) {
						if(entry.getValue() != null && !((String) entry.getValue()).isEmpty()) {
							filtersWhere = filtersWhere.replace("?1", "this.data.semestre >= \\\"" + (String) entry.getValue() + "\\\"");
						} else {
							filtersWhere = filtersWhere.replace("?1", "true");
						}
					} else if(entry.getKey().equals("semestreFin")) {
						if(entry.getValue() != null && !((String) entry.getValue()).isEmpty()) {
							filtersWhere = filtersWhere.replace("?2", "this.data.semestre <= \\\"" + (String) entry.getValue() + "\\\"");
						} else {
							filtersWhere = filtersWhere.replace("?2", "true");
						}
					} else if(entry.getKey().equals("grupoInvestigacion")) {
						if(entry.getValue() != null && !((String) entry.getValue()).isEmpty()) {
							filtersWhere = filtersWhere.replace("?3", "JSON.stringify(this.data).toLowerCase().indexOf( \\\"" + (String) entry.getValue() + "\\\".toLowerCase())!=-1");
						} else {
							filtersWhere = filtersWhere.replace("?3", "true");
						}
					}
			    }
				filtersWhere = filtersWhere.replace("?1", "true");
				filtersWhere = filtersWhere.replace("?2", "true");
				filtersWhere = filtersWhere.replace("?3", "true");
			} catch (Exception e) {
				filtersWhere = "true";
			}
		}
		data.setCountData(this.dataRepository.countByTemplate(template, dependency, filterWhere, 
				filtersWhere));
		return data;
	}
}
