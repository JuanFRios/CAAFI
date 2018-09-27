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
  @Output() loadTemplate = new EventEmitter();
  menuStructure: SafeHtml;
  dependencies: Dependency[];

  constructor(
    private configService: ConfigService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    console.log('menuItems 1', this.menuItems);
    this.menuStructure = this.sanitizer.bypassSecurityTrustHtml('<ng-container *ngFor="let menuItem of menuItems"><button mat-menu-item [matMenuTriggerFor]="sub_menu">{{ menuItem.name }}</button><mat-menu #sub_menu="matMenu"><button *ngFor="let subItem of menuItem.subItems" mat-menu-item (click)="emitLoadTemplate(subItem , menuItem)">{{ subItem.name }}</button></mat-menu></ng-container>');
    this.loadDependencies();
  }

  loadDependencies() {
    this.configService.getTemplateConfig('dependencias')
    .subscribe(response => {
      this.dependencies = response.value;
    },
    error => console.log('ERROR: ', error));
  }

  emitLoadTemplate (subItem, mainItem) {
    console.log('subItem', subItem);
    console.log('mainItem', mainItem);
    this.loadTemplate.emit('hello');
  }

}
