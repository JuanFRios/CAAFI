package co.edu.udea.caafi.controller.v1.api;

import co.edu.udea.caafi.dto.resource.menu.MenuDto;
import co.edu.udea.caafi.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para la gestión de menús de la aplicación
 */
@RestController
@RequestMapping("/menus")
public class MenuController {

  private final MenuService menuService;

  /**
   * Constructor
   *
   * @param menuService servicio de menús
   */
  @Autowired
  public MenuController(MenuService menuService) {
    this.menuService = menuService;
  }

  /**
   * Obtiene el menú principal de la aplicación
   *
   * @return menú principal
   */
  @GetMapping("/principal")
  public MenuDto getMenuPrincipal() {
    return menuService.getMenuPrincipal().orElse(null);
  }
}
