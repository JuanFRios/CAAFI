package co.com.caafi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import co.com.caafi.model.template.FormData;

public interface DataRepository extends MongoRepository<FormData, String> {

	public Optional<FormData> findById(String id);

	public List<FormData> findAll();

	public List<FormData> findByTemplateAndOriginAndDeleted(String template, String origin, boolean deleted, Sort sort);
    
    @Query("{ template: ?0, deleted: false, $where: 'eval(?1) && eval(?2) && eval(?3);' }")
    public List<FormData> findCustomByTemplate(String template, String dependencyFilter, 
    		String filter, String filters, Pageable pageable);
    
    @Query("{ template: ?0, deleted: false, $where:'eval(?1) && eval(?2) && eval(?3);' }")
    public List<FormData> findCustomByTemplate(String template, String dependencyFilter, 
    		String filter, String filters, Sort sort);
    
    @Query("{ template: ?0, deleted: false, $where: 'eval(?1) && eval(?2);' }")
    public List<FormData> findCustomByTemplate(String template, String filter, String filters, Pageable pageable);
    
    @Query(value = "{ template: ?0, deleted: false, $where:'eval(?1) && eval(?2) && eval(?3);' }", count = true)
    public long countByTemplate(String template, String dependencyFilter, String filter, String filters);
    
    @Query(value = "{ 'origin' : ?0, deleted: false, 'creator': ?1, 'data.semestre': ?2 }", fields = "{ '_id' : 1 }")
    public Optional<FormData> findByOriginAndCreator(String formId, String creator, String semestre);

}
