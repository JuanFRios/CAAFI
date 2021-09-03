import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() toggleSidenav = new EventEmitter();

  public userLogged: boolean;
  public username: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.userLogged = this.authService.isUserLogged();
      if (this.userLogged) {
        this.username = user.nombre;
        this.authService.refreshTokenInterval$.subscribe(newToken => {
          if (newToken === 'Error') {
            this.logout();
          } else {
            this.authService.setToken(newToken);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.authService.refreshTokenKiller.next();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public openSidenav(): void {
    this.toggleSidenav.emit();
  }

}
