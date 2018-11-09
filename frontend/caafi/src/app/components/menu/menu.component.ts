import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  @Input() isVisible = true;
  @Output() selectedItem = new EventEmitter();

  private readonly notifier: NotifierService;
  activeModule: string;
  navigationSubscription;
  formId: string;
  dependencyId: string;
  formName: string;
  dependencyName: string;
  menuItems: any;
  breadcrumb = '';

  constructor(
    private configService: ConfigService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    const urlTree = this.router.parseUrl(this.route.snapshot.routeConfig.path);
    this.activeModule = urlTree.root.children['primary'].segments[0].path;

    this.navigationSubscription = this.route.params.subscribe(params => {
      this.formId = this.route.snapshot.paramMap.get('form');
      this.dependencyId = this.route.snapshot.paramMap.get('dependency');

      this.loadMenu(this.activeModule);
    });
  }

  /**
   * Loads the menu of an especified module
   * @param module module to load the menu
   */
  loadMenu(module: string) {
    this.configService.getByName(module).subscribe(
      config => {
        this.menuItems = config.value;
        this.breadcrumb = this.getItemNames(this.menuItems);
        this.emitSelectedItem();
      },
      error => {
        console.log('ERROR: ', error);
      }
    );
  }

  emitSelectedItem() {
    const menuData = {};
    menuData['activeModule'] = this.activeModule;
    menuData['formId'] = this.formId;
    menuData['dependencyId'] = this.dependencyId;
    menuData['formName'] = this.formName;
    menuData['dependencyName'] = this.dependencyName;
    this.selectedItem.emit(menuData);
  }

  getItemNames(menuItems): string {
    let breadcrumb = '';
    for (const menuItem of menuItems) {
      breadcrumb += menuItem.name;
      if (menuItem.path === this.dependencyId) {
        this.dependencyName = menuItem.name;
      }
      if (menuItem.path === this.formId) {
        this.formName = menuItem.name;
      }
      if (menuItem.subItems != null) {
        breadcrumb += ' - ' + this.getItemNames(menuItem.subItems);
      }
    }
    return breadcrumb;
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
