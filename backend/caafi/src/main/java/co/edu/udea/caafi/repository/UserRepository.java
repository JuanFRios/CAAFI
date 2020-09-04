package co.edu.udea.caafi.repository;

import co.edu.udea.caafi.model.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

  /**
   * Obtiene un usuario por el nombre de usuario
   *
   * @param username nombre de usuario
   * @return usuario encontrado
   */
  Optional<User> findByUsername(String username);
}
