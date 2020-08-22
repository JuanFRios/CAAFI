package co.edu.udea.caafi.model.resource.menu;

import co.edu.udea.caafi.model.resource.Resource;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * Entidad para la gestión de menús de la aplicación
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class Menu extends Resource {

  /** Texto del label del menú */
  private String label;

  /** Items del menú */
  private List<MenuItem> menuItems;
}
