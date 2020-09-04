package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.resource.menu.MenuDto;
import co.edu.udea.caafi.model.resource.menu.Menu;

import java.util.Optional;

/**
 * Servicio de gestión de Menús de la aplicación
 */
public interface MenuService extends ResourceService<Menu, MenuDto> {

  /**
   * Obtiene el menú principal de la aplicación
   *
   * @return opcional con el menú principal
   */
  Optional<MenuDto> getMenuPrincipal();
}
