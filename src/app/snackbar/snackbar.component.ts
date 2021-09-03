import { Component, OnInit } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

  private configSucces: MatSnackBarConfig = {
    panelClass: ['style-succes'],
    duration: 3000
  };

  private configError: MatSnackBarConfig = {
    panelClass: ['style-error'],
    duration: 3000
  };

  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  public snackbarSuccess(message) {
    this.snackBar.open(message, 'cerrar', this.configSucces);
  }

  public snackbarError(message) {
    this.snackBar.open(message, 'cerrar', this.configError);
  }

}
