import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'src/app/model/resource/menu/menu-item';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuItemComponent implements OnInit {

  @Input() menuItem: MenuItem;
  @Input() padding: number;

  public expanded: boolean;

  constructor(
    private router: Router
  ) {
    this.expanded = false;
  }

  ngOnInit(): void {
  }

  public toggleSubitems(): void {
    this.expanded = !this.expanded;
  }

}
