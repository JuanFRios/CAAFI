import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Dependency } from '../../common/dependency';
import { ConfigService } from '../../services/config.service';
import { DomSanitizer, SafeHtml } from '../../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input() menuItems: any;
  @Input() module: string;

  constructor() { }

  ngOnInit() {
  }

}
