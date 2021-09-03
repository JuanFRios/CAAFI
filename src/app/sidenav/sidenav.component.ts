import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() position: 'left' | 'right';
  @Input() size: number;

  public opened: boolean;

  constructor(private router: Router) {
    this.opened = false;
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      // close sidenav on routing
      this.close();
    });
  }

  public toggle(): void {
    this.opened = !this.opened;
  }

  public close(): void {
    this.opened = false;
  }

}
