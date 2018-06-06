package co.com.caafi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

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
			String sortColumn, String sortOrder, int pageNumber, int pageSize) {

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
		
		Sort sort = new Sort(direction, column);
		
		if(pageSize == -1) {
			return this.dataRepository.findCustomByTemplate(template, dependency, filter, sort);
		} else {
			return this.dataRepository.findCustomByTemplate(template, dependency, filter,
					new PageRequest(pageNumber, pageSize, sort));
		}		
	}

	public FormData count(String template, String dependency, String filter) {
		FormData data = new FormData();
		data.setCountData(this.dataRepository.countByTemplate(template, dependency, filter));
		return data;
	}
}
