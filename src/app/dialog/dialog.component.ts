import { Component, OnInit, Input } from '@angular/core';
import { DialogConfig } from '../model/dialog/dialog-config';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() dc: DialogConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
