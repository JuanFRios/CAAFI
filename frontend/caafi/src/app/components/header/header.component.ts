import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  moduloActivo : string;
  esSesionIniciada : boolean;

  constructor() {
   }

  ngOnInit() {
  }

}
