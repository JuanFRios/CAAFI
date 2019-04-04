import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { Module } from '../../common/module';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() isVisible = true;
  @Output() selectedItem = new EventEmitter();
  @Output() loaded = new EventEmitter();

  private readonly notifier: NotifierService;
  activeModule: string;
  activeModuleName: string;
  navigationSubscription;
  formId: string;
  dependencyId: string;
  formName: string;
  dependencyName: string;
  menuItems: any;
  breadcrumb = '';
  allDataAccess = false;
  noDependency = false;
  lista_modulos: Module[];
  evaluationDoc = '';
  noReport = false;
  adminReport = false;

  constructor(
    private configService: ConfigService,
    public loginService: LoginService,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    if (this.loginService.isLogIn()) {
      this.configService.getByName('LISTA_MODULOS')
        .subscribe(confi => {
          this.lista_modulos = confi.value;

          const urlTree = this.router.parseUrl(this.route.snapshot.routeConfig.path);
          this.activeModule = urlTree.root.children['primary'].segments[0].path;
          for (let i = 0; i < confi.value.length; i++) {
            if (confi.value[i].path === this.activeModule) {
              this.activeModuleName = confi.value[i].name;
              break;
            }
          }

          this.navigationSubscription = this.route.params.subscribe(params => {
            this.formId = this.route.snapshot.paramMap.get('form');
            this.dependencyId = this.route.snapshot.paramMap.get('dependency');
            this.loadMenu(this.activeModule);
          });
        },
        error => {}
      );
    }
  }

  ngAfterViewInit() {
    this.loaded.emit();
  }

  /**
   * Loads the menu of an especified module
   * @param module module to load the menu
   */
  loadMenu(module: string) {
    this.configService.getTemplateConfig(module).subscribe(
      config => {
        this.menuItems = config.value;
        this.getItemNames(this.menuItems);
        this.breadcrumb = this.getBreadcrumb(this.menuItems);
        this.emitSelectedItem();
      },
      error => {}
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
    menuData['evaluationDoc'] = this.evaluationDoc;
    menuData['noReport'] = this.noReport;
    menuData['adminReport'] = this.adminReport;
    this.selectedItem.emit(menuData);
  }

  getItemNames(menuItems) {
    let mItem = null;
    for (const menuItem of menuItems) {
      if (menuItem.path === this.dependencyId || (this.dependencyId == null && menuItem.path === this.formId)) {
        this.dependencyName = menuItem.name;
        if (menuItem.noDependency) {
          this.noDependency = menuItem.noDependency;
        }
        if (menuItem.evaluationDoc) {
          this.evaluationDoc = menuItem.evaluationDoc;
        }
        mItem = menuItem;
        break;
      }
    }
    if (mItem != null) {
      this.getFormNames(mItem);
    }
  }

  getFormNames(menuItem) {
    if (menuItem.subItems && menuItem.subItems.length > 0) {
      for (const mItem of menuItem.subItems) {
        this.getFormNames(mItem);
      }
    } else if (menuItem.path === this.formId) {
        this.formName = menuItem.name;
        this.allDataAccess = menuItem.allDataAccess;
        this.noReport = menuItem.noReport;
        this.adminReport = menuItem.adminReport;
    }
  }

  getBreadcrumb(menuItems): string {
    const breadcrumbs = {};
    this.loop(menuItems, [], breadcrumbs, '');
    let breadcrumb;
    if (this.formId != null && this.dependencyId != null) {
      breadcrumb = breadcrumbs[this.formId + ':' + this.dependencyId].map(o => o).join(' - ');
    } else if (this.dependencyId != null) {
      if (breadcrumbs[this.dependencyId + ':' + this.dependencyId]) {
        breadcrumb = breadcrumbs[this.dependencyId + ':' + this.dependencyId].map(o => o).join(' - ');
      }
    } else if (this.formId != null) {
      breadcrumb = breadcrumbs[this.formId + ':' + this.formId].map(o => o).join(' - ');
    } else {
      breadcrumb = '';
    }
    return breadcrumb;
  }

  loop(menuItems, path, breadcrumbs, root) {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].subItems) {
        if (root === '') {
          this.loop(menuItems[i].subItems, [...path, menuItems[i].name], breadcrumbs, menuItems[i].path);
        } else {
          this.loop(menuItems[i].subItems, [...path, menuItems[i].name], breadcrumbs, root);
        }
      } else {
        if (root === '') {
          breadcrumbs[menuItems[i].path + ':' + menuItems[i].path] = [...path, menuItems[i].name];
        } else {
          breadcrumbs[menuItems[i].path + ':' + root] = [...path, menuItems[i].name];
        }
      }
    }
  }

  logOut() {
    this.loginService.logOut()
      .subscribe(usuario => {});
    localStorage.removeItem('tokenUser');
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
