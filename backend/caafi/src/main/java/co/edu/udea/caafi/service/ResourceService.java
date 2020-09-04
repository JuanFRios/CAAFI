package co.edu.udea.caafi.service;

import co.edu.udea.caafi.model.resource.Resource;
import co.edu.udea.caafi.model.user.Role;
import org.modelmapper.ModelMapper;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Interface con métodos genericos de los recursos
 * @param <E> tipo Entidad
 * @param <D> tipo Dto
 */
public interface ResourceService<E extends Resource, D> {

  /**
   * Obtiene un recurso a patir del ID, valida que el usuario logueado tenga permiso al recurso
   *
   * @param id ID del recurso
   * @return opcional con el recurso encontrado
   */
  default Optional<D> findById(String id) {
    Optional<E> resource = findEntityById(id);
    return resource.map(e -> getModelMapper().map(e, getEntityDtoClass()));
  }

  /**
   * Obtiene una entidad de recurso a partir del ID del recurso
   *
   * @param id ID del recurso
   * @return entidad con datos del recurso encontrado
   */
  default Optional<E> findEntityById(String id) {
    E resource = getMongoTemplate().findById(id, getEntityClass());
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (resource != null && (resource.getRoles() == null || resource.getRoles().isEmpty()
        || resource.getRoles().stream().anyMatch(role -> role.getAuthority().equals("ROLE_ANONYMOUS"))
        || resource.getRoles().stream()
        .map(Role::getAuthority)
        .anyMatch(authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList())::contains))) {
      return Optional.of(resource);
    }
    return Optional.empty();
  }

  /**
   * Obtiene la plantilla de mongo para usar la base de datos
   *
   * @return Mongo Template
   */
  MongoTemplate getMongoTemplate();

  /**
   * Obtiene el mapeador de objetos
   *
   * @return Model Mapper
   */
  ModelMapper getModelMapper();

  /**
   * Obtiene el tipo de la clase de la entidad
   *
   * @return tipo de clase entidad
   */
  Class<E> getEntityClass();

  /**
   * Obtiene el tipo de la clase del DTO
   *
   * @return tipo de clase DTO
   */
  Class<D> getEntityDtoClass();
}
