import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Dependency } from '../../common/dependency';
import { ConfigService } from '../../services/config.service';
import { DomSanitizer, SafeHtml } from '../../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnChanges {

  @Input() menuItems: any;
  @Input() module: string;
  @Input() form?: string;
  @Input() dependency?: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const formName: SimpleChange = changes.form;
    this.form = formName.currentValue;
  }

}
