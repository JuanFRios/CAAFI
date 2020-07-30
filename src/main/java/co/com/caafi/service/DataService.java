package co.com.caafi.service;

import co.com.caafi.model.User;
import co.com.caafi.model.template.FormData;
import co.com.caafi.repository.DataRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.wnameless.json.flattener.JsonFlattener;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.CriteriaDefinition;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Optional;

@Service
public class DataService {
    @Autowired
    DataRepository dataRepository;

    @Autowired
    MongoTemplate mongoTemplate;
    
    @Autowired
    TemplateService templateService;
    
    @Autowired
    LogService logService;
    
    Logger logger = LoggerFactory.getLogger(DataService.class);

    public FormData findById(String id) {
        return this.dataRepository.findById(id).get();
    }
    
    public void deleteById(String id, User user) {
    		FormData data = this.dataRepository.findById(id).get();
    		data.setDeleted(true);
    		data.setEliminator(user.getDocument());		
        this.dataRepository.save(data);
    }

    public List<FormData> findAll() {
        return this.dataRepository.findAll();
    }

    public List<Object> findByJson(String template, String fields) {
        BasicQuery query = new BasicQuery(template, JsonFlattener.flatten(fields));
        return this.mongoTemplate.find(query, Object.class, "data");
    }

    public FormData save(FormData data, Authentication authentication) {
    		FormData dataSaved = null;
    		try {
        		if(authentication != null) {
        			data.setCreator(((User)authentication.getPrincipal()).getDocument());
        	        dataSaved = this.dataRepository.save(data); 
        		} else {
        			dataSaved = save(data);
        		}
            this.logService.info("Saved Form", dataSaved.getId());
    		} catch (Exception e) {
    			this.logService.error("Saved Form Error: " + e.getMessage() + ", Cause: " + e.getCause() + ", Trace: " + e.getStackTrace(), data);
    		}
    		return dataSaved;
    }
    
    private FormData save(FormData data) {
	    if(this.templateService.findByName(data.getTemplate()).isPublic()) {
	    	if (data.getCreator() == null) {
	    		data.setCreator("public");
	    	}
	    	return this.dataRepository.save(data);
	    } else {
	    	return null;
	    }
	}

	public List<FormData> findByTemplate(String template, String dependency, String filter,
			String sortColumn, String sortOrder, int pageNumber, int pageSize, String filters) {

		Sort sort = getSort(sortColumn, sortOrder);
		String dependencyFilter = getDependencyFilter(dependency);
		String filterWhere = getGenericFilter(filter);
		String filtersWhere = getFilters(filters);
		
		if(pageSize == -1) {
			return this.dataRepository.findCustomByTemplate(template, dependencyFilter, filterWhere, 
					filtersWhere, sort);
		} else {
			return this.dataRepository.findCustomByTemplate(template, dependencyFilter, filterWhere,
					filtersWhere, PageRequest.of(pageNumber, pageSize, sort));
		}
	}
	
	public List<FormData> findByTemplate(String template, String filter, String sortColumn, String sortOrder, int pageNumber, 
			int pageSize, String filters) {

		Sort sort = getSort(sortColumn, sortOrder);
		String filterWhere = getGenericFilter(filter);
		String filtersWhere = getFilters(filters);
		
		return this.dataRepository.findCustomByTemplate(template, filterWhere, filtersWhere, PageRequest.of(pageNumber, pageSize, sort));
	}

	private String getDependencyFilter(String dependency) {
		String dependencyFilter = "true";
		if(dependency != null && !dependency.isEmpty() && !"ALL".equals(dependency)) {
			dependencyFilter = "JSON.stringify(this).indexOf( \\\"" + dependency + "\\\" )!=-1";
		}
		return dependencyFilter;
	}

	private String getFilters(String filters) {
		String filtersWhere = "true";
		if(filters != null && !filters.isEmpty() && !"{}".equals(filters)) {
			try {
				HashMap<String,Object> result = new ObjectMapper().readValue(filters, HashMap.class);
				filtersWhere = "true";
				for (Entry<String, Object> entry : result.entrySet()) {
					if(entry.getValue() != null) {
						String[] entryKey = entry.getKey().split("-");
						String type = entryKey[0];
						String name = entryKey[1];
						switch(type) {
						case "tea": // Text Equals All
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && JSON.stringify(this.data).toLowerCase().indexOf( \\\"" + (String) entry.getValue() + "\\\".toLowerCase() ) != -1";
							}
							break;
						case "tge": // Text Greater or Equals than
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && this.data." + name + " >= \\\"" + (String) entry.getValue() + "\\\"";
							}
							break;
						case "tle": // Text Less or Equals than
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && this.data." + name + " <= \\\"" + (String) entry.getValue() + "\\\"";
							}
							break;
						case "te": // Text Equals
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && this.data." + name + " == \\\"" + (String) entry.getValue() + "\\\"";
							}
							break;
						case "tl": // Text Like
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && this.data." + name + ".toLowerCase().indexOf( \\\"" + (String) entry.getValue() + "\\\".toLowerCase() ) != -1";
							}
							break;
						case "tll": // Text Like List
							List<String> list = (List<String>) entry.getValue();
							if(!list.isEmpty()) {
								filtersWhere += " && ( false";
								for(String listItem : list) {
									filtersWhere += " || (this.data." + name + " ? JSON.stringify(this.data." + name + ").toLowerCase().indexOf( \\\"" + listItem + "\\\".toLowerCase() ) != -1 : false)";
								}
								filtersWhere += " )";
							}
							break;
						case "dge": // Date Greater or Equals than
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && new Date(this.data." + name + ").getTime() >= new Date(\\\"" + (String) entry.getValue() + "\\\").getTime()";
							}
							break;
						case "dle": // Date Less or Equals than
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && new Date(this.data." + name + ").getTime() <= new Date(\\\"" + (String) entry.getValue() + "\\\").getTime()";
							}
							break;
						case "dage": // Date Greater or Equals than - saved date
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && new Date(this." + name + ").getTime() >= new Date(\\\"" + (String) entry.getValue() + "\\\").getTime()";
							}
							break;
						case "dale": // Date Less or Equals than - saved date
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && new Date(this." + name + ").getTime() <= new Date(\\\"" + (String) entry.getValue() + "\\\").getTime()";
							}
							break;
						case "nge": // Number Greater or Equals than
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && this.data." + name + " >= " + (String) entry.getValue();
							}
							break;
						case "nle": // Number Less or Equals than
							if(!((String)entry.getValue()).isEmpty()) {
								filtersWhere += " && this.data." + name + " <= " + (String) entry.getValue();
							}
							break;
						case "ne": // Number Equals than
							if(!(entry.getValue().toString()).isEmpty()) {
								filtersWhere += " && this.data." + name + " == " + entry.getValue().toString();
							}
							break;
						default:
							filtersWhere += " && true";
							break;
						}
					}
			    }
			} catch (Exception e) {
				filtersWhere = "true";
			}
		}
		return filtersWhere;
	}

	private String getGenericFilter(String filter) {
		String filterWhere = "true";
		String[] filters = filter.split(";");
		for(String filt : filters) {
			if(filt != null && !filt.isEmpty()) {
				filterWhere += " && (JSON.stringify(this.data).toLowerCase().indexOf( \\\"" + filt + "\\\".toLowerCase() )!=-1)";
			}
		}
		return filterWhere;
	}

	private Sort getSort(String sortColumn, String sortOrder) {
		Direction direction;
		if(sortOrder != null && !sortOrder.isEmpty() && "asc".equals(sortOrder)) {			
			direction = Sort.Direction.ASC;
		} else {
			direction = Sort.Direction.DESC;
		}
		
		Order order = new Order(direction, sortColumn);
		return Sort.by(order);
	}

	public FormData count(String template, String dependency, String filter, String filters) {
		FormData data = new FormData();
		String dependencyFilter = getDependencyFilter(dependency);
		String filterWhere = getGenericFilter(filter);
		String filtersWhere = getFilters(filters);
		data.setCountData(this.dataRepository.countByTemplate(template, dependencyFilter, filterWhere, 
				filtersWhere));
		return data;
	}

	public Optional<FormData> getByFormAndCreator(String semester, String formId, String creator) {
		return this.dataRepository.findByOriginAndCreator(formId, creator, semester);
	}

	public List<Object> findByCollection(String collection, String sortColumn, String sortOrder, int pageNumber,
			int pageSize, String filters) {
		
		// Order
		Sort sort = getSort(sortColumn, sortOrder);
		
		// Pagination
		Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
		
		// Query
		Query query = new Query();
		query.with(sort);
		query.with(pageable);
		
		// Criteria
		try {
			JSONObject jsonFilters = new JSONObject(filters);
			Iterator<String> keys = jsonFilters.keys();
			while(keys.hasNext()) {
			    String key = keys.next();
			    query.addCriteria(getCriteria(key, (String) jsonFilters.get(key)));
			}
		} catch (JSONException e) {
			logger.error("Error convirtiendo los filtros en objeto json, error: " + e.getMessage(), e);
		}
		
		// Fields
		query.fields().exclude("_id");
		
		// Execution
		return this.mongoTemplate.find(query, Object.class, collection);
	}
	
	public CriteriaDefinition getCriteria(String filter, String value) {
		String[] entryKey = filter.split("-");
		String filterType = entryKey[0];
		String filterName = entryKey[1];
		switch(filterType) {
		case "te": // Text Equals
			return Criteria.where(filterName).is(value);
		/*
		case "tea": // Text Equals All
			if(!((String)entry.getValue()).isEmpty()) {
				filtersWhere += " && JSON.stringify(this.data).toLowerCase().indexOf( \\\"" + (String) entry.getValue() + "\\\".toLowerCase() ) != -1";
			}
			break;
		case "tge": // Text Greater or Equals than
			if(!((String)entry.getValue()).isEmpty()) {
				filtersWhere += " && this.data." + name + " >= \\\"" + (String) entry.getValue() + "\\\"";
			}
			break;
		case "tle": // Text Less or Equals than
			if(!((String)entry.getValue()).isEmpty()) {
				filtersWhere += " && this.data." + name + " <= \\\"" + (String) entry.getValue() + "\\\"";
			}
			break;
		case "tl": // Text Like
			if(!((String)entry.getValue()).isEmpty()) {
				filtersWhere += " && this.data." + name + ".toLowerCase().indexOf( \\\"" + (String) entry.getValue() + "\\\".toLowerCase() ) != -1";
			}
			break;
		case "tll": // Text Like List
			List<String> list = (List<String>) entry.getValue();
			if(!list.isEmpty()) {
				filtersWhere += " && ( false";
				for(String listItem : list) {
					filtersWhere += " || (this.data." + name + " ? JSON.stringify(this.data." + name + ").toLowerCase().indexOf( \\\"" + listItem + "\\\".toLowerCase() ) != -1 : false)";
				}
				filtersWhere += " )";
			}
			break;
		case "dge": // Date Greater or Equals than
			if(!((String)entry.getValue()).isEmpty()) {
				filtersWhere += " && new Date(this.data." + name + ").getTime() >= new Date(\\\"" + (String) entry.getValue() + "\\\").getTime()";
			}
			break;
		case "dle": // Date Less or Equals than
			if(!((String)entry.getValue()).isEmpty()) {
				filtersWhere += " && new Date(this.data." + name + ").getTime() <= new Date(\\\"" + (String) entry.getValue() + "\\\").getTime()";
			}
			break;
		case "dage": // Date Greater or Equals than - saved date
			if(!((String)entry.getValue()).isEmpty()) {
				filtersWhere += " && new Date(this." + name + ").getTime() >= new Date(\\\"" + (String) entry.getValue() + "\\\").getTime()";
			}
			break;
		case "dale": // Date Less or Equals than - saved date
			if(!((String)entry.getValue()).isEmpty()) {
				filtersWhere += " && new Date(this." + name + ").getTime() <= new Date(\\\"" + (String) entry.getValue() + "\\\").getTime()";
			}
			break;
		case "nge": // Number Greater or Equals than
			if(!((String)entry.getValue()).isEmpty()) {
				filtersWhere += " && this.data." + name + " >= " + (String) entry.getValue();
			}
			break;
		case "nle": // Number Less or Equals than
			if(!((String)entry.getValue()).isEmpty()) {
				filtersWhere += " && this.data." + name + " <= " + (String) entry.getValue();
			}
			break;
		*/
		default:
			return null;
		}
	}
}
