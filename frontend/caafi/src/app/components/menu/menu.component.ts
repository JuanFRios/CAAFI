import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Dependency } from '../../common/dependency';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Output() loadTemplateEmitter = new EventEmitter();
  dependencies: Dependency[];

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.loadDependencies();
  }

  loadDependencies() {
    this.configService.getTemplateConfig('dependencias')
    .subscribe(response => {
      this.dependencies = response.value;
    },
    error => console.log('ERROR: ', error));
  }

  loadForm() {
    console.log('loading...');
  }

}
