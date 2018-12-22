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
  allDataAccess = false;
  noDependency = false;

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
        this.getItemNames(this.menuItems);
        this.breadcrumb = this.getBreadcrumb(this.menuItems);
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
    menuData['allDataAccess'] = this.allDataAccess;
    menuData['noDependency'] = this.noDependency;
    this.selectedItem.emit(menuData);
  }

  getItemNames(menuItems) {
    for (const menuItem of menuItems) {
      if (menuItem.path === this.dependencyId) {
        this.dependencyName = menuItem.name;
        if (menuItem.noDependency) {
          this.noDependency = menuItem.noDependency;
        }
      }
      if (menuItem.path === this.formId) {
        this.formName = menuItem.name;
        if (menuItem.allDataAccess) {
          this.allDataAccess = menuItem.allDataAccess;
        }
      }
    }
  }

  getBreadcrumb(menuItems): string {
    const breadcrumbs = {};
    this.loop(menuItems, [], breadcrumbs);
    let breadcrumb;
    this.formId != null ? breadcrumb = breadcrumbs[this.formId].map(o => o).join(' - ') : breadcrumb = '';
    return breadcrumb;
  }

  loop(menuItems, path, breadcrumbs) {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].subItems) {
        this.loop(menuItems[i].subItems, [...path, menuItems[i].name], breadcrumbs);
      } else {
        breadcrumbs[menuItems[i].path] = [...path, menuItems[i].name];
      }
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
