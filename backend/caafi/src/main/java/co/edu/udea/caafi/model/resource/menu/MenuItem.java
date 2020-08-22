package co.edu.udea.caafi.model.resource.menu;

import co.edu.udea.caafi.model.user.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.List;

/**
 * Entidad para la gestión de los items de menú
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class MenuItem {

  /** Texto del label del item de menú */
  private String label;

  /** Nombre dle icono del item de menú */
  private String icon;

  /** Ruta a la que dirige el item de menú */
  private String route;

  /** Lista de sub items si aplica */
  private List<MenuItem> subitems;

  /** Lista de roles que tienen acceso al item de menú */
  @DBRef
  private List<Role> roles;
}
