package co.com.caafi.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import co.com.caafi.model.template.FormData;

public interface DataRepository extends MongoRepository<FormData, String> {

	public FormData findById(String id);

	public List<FormData> findAll();

	public List<FormData> findByTemplateAndOriginAndDeleted(String template, String origin, boolean deleted, Sort sort);
	
    public FormData save(FormData data);
    
    @Query("{ template: ?0, deleted: false, $where: 'JSON.stringify(this.data).indexOf( ?1 )!=-1 && eval(?2) && eval(?3);' }")
    public List<FormData> findCustomByTemplate(String template, String dependency, 
    		String filter, String filters, Pageable pageable);
    
    @Query("{ template: ?0, deleted: false, $where:'JSON.stringify(this.data).indexOf( ?1 )!=-1 && eval(?2) && eval(?3);' }")
    public List<FormData> findCustomByTemplate(String template, String dependency, 
    		String filter, String filters, Sort sort);
    
    @Query(value = "{ template: ?0, deleted: false, $where:'JSON.stringify(this.data).indexOf( ?1 )!=-1 && eval(?2) && eval(?3);' }", count = true)
    public long countByTemplate(String template, String dependency, String filter, String filters);

}
