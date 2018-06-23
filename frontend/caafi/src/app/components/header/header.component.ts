import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ConfigService } from '../../services/config.service';
import { LoginService } from '../../services/login.service';
import { Module } from '../../common/module';
import {
  ActivatedRoute,
  Router,
  NavigationExtras
} from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  moduloActivo: string;
  lista_modulos: Module[];


  constructor(private configService: ConfigService, public loginService: LoginService, public router: Router) {
  }

  ngOnInit() {
    this.configService.getByName('LISTA_MODULOS')
      .subscribe(confi => {
        this.lista_modulos = confi.value;
        this.moduloActivo = confi.value[0].name;
      });

    this.loginService.check()
      .subscribe(usuario => {

      }, error => {
       if (localStorage.getItem('tokenUser')) {
         localStorage.removeItem('tokenUser');
        this.router.navigate(['/home']);
      }

      });
  }

  cambiarModuloActivo(moduloSeleccionado: string) {
    this.moduloActivo = moduloSeleccionado;

  }

  logOut() {
    this.loginService.logOut()
      .subscribe(usuario => {

      });
    localStorage.removeItem('tokenUser');
    this.router.navigate(['/home']);
  }

}
