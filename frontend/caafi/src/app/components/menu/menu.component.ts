import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { Module } from '../../common/module';
import { LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() isVisible = true;
  @Output() selectedItem = new EventEmitter();
  @Output() loaded = new EventEmitter();

  activeModule: Module;
  activeItem: Object;
  navigationSubscriptionPath: Subscription;
  navigationSubscriptionParams: Subscription;
  params: string[];
  pathArray: Array<Object>;

  formName: string;
  dependencyName: string;
  menuItems: any;
  breadcrumb = '';
  pathway = '';
  allDataAccess = false;
  noDependency = false;
  lista_modulos: Module[];
  evaluationDoc = '';
  noReport = false;
  adminReport = false;
  urlArray: string[];
  export = false;

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
          this.getMenuParams().then(res => {
            this.loadMenuData();
          });
        },
        error => {}
      );
    }
  }

  loadMenuData(): Promise<any> {
    return new Promise(resolve => {
      // Get active module
      this.navigationSubscriptionPath = this.route.pathFromRoot[1].url.subscribe(urlArr => {
        this.activeModule = this.lista_modulos.find(mod => mod.path === urlArr[0].path);
        urlArr.shift();
        this.urlArray = urlArr.map(o => o.path);
        this.loadMenu();
        resolve();
      });
    });
  }

  getMenuParams(): Promise<any> {
    return new Promise(resolve => {
      this.navigationSubscriptionParams = this.route.params.subscribe(params => {
        const param: string[] = new Array();
        param['formId'] = params['form'];
        param['dependencyId'] = params['dependency'];
        this.params = param;
        resolve();
      });
    });
  }

  ngAfterViewInit() {
    this.loaded.emit();
  }

  /**
   * Loads the menu of an especified module
   * @param module module to load the menu
   */
  loadMenu() {
    this.configService.getTemplateConfig(this.activeModule.path).subscribe(
      config => {
        this.menuItems = config.value;
        this.pathArray = new Array();
        this.activeItem = this.getActiveItem(config.value, 0, this.urlArray.length, 0, true, this.pathArray);
        this.breadcrumb = this.pathArray.map(o => o['name']).join(' - ');
        this.pathway = this.pathArray.map(o => o['path']).join('|');
        this.emitSelectedItem();
      },
      error => {}
    );
  }

  emitSelectedItem() {
    const menuData = {};
    menuData['activeModule'] = this.activeModule.path;
    menuData['formId'] = this.params['formId'];
    menuData['dependencyId'] = this.params['dependencyId'];
    menuData['formName'] = this.params['formId'] ? this.pathArray.find(o => o['path'] === this.params['formId'])['name'] : null;
    menuData['dependencyName'] =
      this.params['dependencyId'] ? this.pathArray.find(o => o['path'] === this.params['dependencyId'])['name'] : null;
    menuData['allDataAccess'] = this.activeItem ? this.activeItem['allDataAccess'] : false;
    menuData['noDependency'] = this.activeItem ? this.activeItem['noDependency'] : false;
    menuData['evaluationDoc'] = this.activeItem ? this.activeItem['evaluationDoc'] : null;
    menuData['noReport'] = this.activeItem ? this.activeItem['noReport'] : false;
    menuData['adminReport'] = this.activeItem ? this.activeItem['adminReport'] : false;
    menuData['export'] = this.activeItem ? this.activeItem['export'] : false;
    menuData['dependencyFormalName'] =
      this.params['dependencyId'] ? this.pathArray.find(o => o['path'] === this.params['dependencyId'])['formalName'] : null;
    menuData['pathway'] = this.pathway;
    this.selectedItem.emit(menuData);
  }

  getActiveItem(item, iterItem, countPath, iterUrl, root, pathArray: Array<Object>) {
    if (this.urlArray == null || this.urlArray.length <= 0) {
      return null;
    }
    if (iterUrl === countPath) {
      return item;
    }
    if (root && item[iterItem].path === this.urlArray[iterUrl]) {
      pathArray.push({'path': item[iterItem].path, 'name': item[iterItem].name, 'formalName': item[iterItem].formalName});
      return this.getActiveItem(item[iterItem], 0, countPath, ++iterUrl, false, pathArray);
    } else if (root && item[iterItem].path !== this.urlArray[iterUrl]) {
      return this.getActiveItem(item, ++iterItem, countPath, iterUrl, true, pathArray);
    } else if (!root && item.subItems[iterItem].path === this.urlArray[iterUrl]) {
      pathArray.push({'path': item.subItems[iterItem].path, 'name': item.subItems[iterItem].name,
        'formalName': item.subItems[iterItem].formalName});
      return this.getActiveItem(item.subItems[iterItem], 0, countPath, ++iterUrl, false, pathArray);
    } else {
      return this.getActiveItem(item, ++iterItem, countPath, iterUrl, false, pathArray);
    }
  }

  logOut() {
    this.loginService.logOut()
      .subscribe(usuario => {});
    localStorage.removeItem('tokenUser');
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    if (this.navigationSubscriptionPath) {
      this.navigationSubscriptionPath.unsubscribe();
    }
    if (this.navigationSubscriptionParams) {
      this.navigationSubscriptionParams.unsubscribe();
    }
  }
}
