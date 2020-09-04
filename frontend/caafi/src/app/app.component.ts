import { Component, ViewChild } from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthService } from './service/auth.service';
import { User } from './model/user/user';
import { Menu } from './model/resource/menu/menu';
import { MenuService } from './service/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('sidenavMenu') sidenavMenu: SidenavComponent;
  
  public title;
  public menu: Menu;
  public user: User;
  public userLogged: boolean;

  constructor(
    private authService: AuthService,
    private menuService: MenuService
  ) {
    this.title = 'caafi';
    this.authService.currentUser.subscribe(user => {
      if (this.authService.isUserLogged()) {
        this.menuService.getMenuPrincipal().subscribe(response => {
          this.menu = response;
        });
        this.user = user;
        this.userLogged = true;
      } else {
        this.userLogged = false;
      }
    });
  }

  public toggleSidenav(): void {
    this.sidenavMenu.toggle();
  }
}
