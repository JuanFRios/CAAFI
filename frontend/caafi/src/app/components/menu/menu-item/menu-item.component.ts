import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  @Input() items: any;
  @Input() module: string;
  @Input() parent?: string;
  @ViewChild('childMenu') public childMenu;

  constructor(
    public router: Router
  ) { }

  ngOnInit() {}

}
