import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  moduloActivo : string;
  lista_modulos = [ {"id":1, "nombre":"Formularios", "ruta":"formularios"},
  {"id":2, "nombre":"Reportes y Búsqueda", "ruta":"reportes"},
  {"id":3, "nombre":"Autoevaluación", "ruta":"autoevaluacion"}
];

  constructor() {
   }

  ngOnInit() {
  }

  cambiarModuloActivo(moduloSeleccionado : string){
    this.moduloActivo = moduloSeleccionado;
    
  }

}
