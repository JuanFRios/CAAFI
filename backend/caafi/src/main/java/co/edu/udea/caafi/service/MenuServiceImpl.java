package co.edu.udea.caafi.service;

import co.edu.udea.caafi.dto.resource.menu.MenuDto;
import co.edu.udea.caafi.dto.user.UserDto;
import co.edu.udea.caafi.model.resource.menu.Menu;
import co.edu.udea.caafi.model.resource.menu.MenuItem;
import co.edu.udea.caafi.model.user.User;
import co.edu.udea.caafi.utils.RoleUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio de gestión de Menús de la aplicación
 */
@Service
public class MenuServiceImpl implements MenuService {

  private final ModelMapper modelMapper;

  private final MongoTemplate mongoTemplate;

  @Autowired
  public MenuServiceImpl(ModelMapper modelMapper, MongoTemplate mongoTemplate) {
    this.modelMapper = modelMapper;
    this.mongoTemplate = mongoTemplate;
  }

  /**
   * Obtiene el menú principal de la aplicación
   *
   * @return opcional con el menú principal
   */
  @Override
  public Optional<MenuDto> getMenuPrincipal() {
    Optional<MenuDto> menuDto = Optional.empty();
    Optional<Menu> menuResource = findEntityById("5f3998f37955a3d347ba6531");
    if(menuResource.isPresent()) {
      Menu menu = menuResource.get();
      menu.setMenuItems(getMenuItemsWithAuthorities(menu.getMenuItems()));
      menuDto = Optional.of(modelMapper.map(menu, MenuDto.class));
    }
    return menuDto;
  }

  /**
   * Obtiene los itmes de menú que el usuario actual puede ver
   *
   * @param menuItems lista de items de menú
   * @return lista de menú con acceso
   */
  private List<MenuItem> getMenuItemsWithAuthorities(List<MenuItem> menuItems) {
    return menuItems.stream()
        .filter(menuItem -> RoleUtils.isAuthorizedRoles(menuItem.getRoles()))
        .map(menuItem -> menuItem.setSubitems(
            menuItem.getSubitems() != null
                ? getMenuItemsWithAuthorities(menuItem.getSubitems())
                : null
        )).collect(Collectors.toList());
  }

  @Override
  public MongoTemplate getMongoTemplate() {
    return mongoTemplate;
  }

  @Override
  public ModelMapper getModelMapper() {
    return modelMapper;
  }

  @Override
  public Class<Menu> getEntityClass() {
    return Menu.class;
  }

  @Override
  public Class<MenuDto> getEntityDtoClass() {
    return MenuDto.class;
  }
}
