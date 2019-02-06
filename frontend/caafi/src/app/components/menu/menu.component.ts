import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
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
export class MenuComponent implements OnInit, OnDestroy {

  @Input() isVisible = true;
  @Output() selectedItem = new EventEmitter();

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
        error => {
          console.log('ERROR: ', error);
        }
      );
    }
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
    menuData['evaluationDoc'] = this.evaluationDoc;
    this.selectedItem.emit(menuData);
  }

  getItemNames(menuItems) {
    for (const menuItem of menuItems) {
      if (menuItem.path === this.dependencyId) {
        this.dependencyName = menuItem.name;
        if (menuItem.noDependency) {
          this.noDependency = menuItem.noDependency;
        }
        if (menuItem.evaluationDoc) {
          this.evaluationDoc = menuItem.evaluationDoc;
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
    this.loop(menuItems, [], breadcrumbs, '');
    let breadcrumb;
    if (this.formId != null) {
      breadcrumb = breadcrumbs[this.formId + ':' + this.dependencyId].map(o => o).join(' - ');
    } else {
      if (breadcrumbs[this.dependencyId + ':' + this.dependencyId]) {
        breadcrumb = breadcrumbs[this.dependencyId + ':' + this.dependencyId].map(o => o).join(' - ');
      }
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
      .subscribe(usuario => {
        console.log(usuario);
      });
    localStorage.removeItem('tokenUser');
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
