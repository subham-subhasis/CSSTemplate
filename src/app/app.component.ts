import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { GeneralService } from './modules/dashboard/services/general.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DashboardList } from './modules/dashboard/models/dashboard.model';
import { ErrorMessages } from './utils/constants';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { SettingsService } from './services/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AppUtils } from './utils/app.util';
import { ApplicationHttpClientService } from './interceptors/application-http-client.service';
import { ApiConfigService } from './config.service';
import { UserIdleService } from 'angular-user-idle';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { Toolbar } from './modules/dashboard/models/toolbar.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  userId = 0;
  currentUrl = '';
  images = [];
  headerProperties = {};
  isPadding = true;
  initHeight = false;
  subscription: Subscription;
  subscription1: Subscription;
  isLeftNavRequired = true;
  isRegistration = false;
  isNewPassword = false;
  isWorkflow = false;
  constructor(
    private generalService: GeneralService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private settingsService: SettingsService,
    private location: Location,
    private translate: TranslateService,
    private appUtils: AppUtils,
    private applicationHttpClient: ApplicationHttpClientService,
    private userIdleService: UserIdleService
  ) {

  }
  ngOnInit() {
    const url = this.location.path();
    if (this.settingsService.properties['readFromProperty']) {
      const lang = this.settingsService.properties['locale'];
      this.translate.setDefaultLang(lang);
    }

    this.generalService.setUrl();
    this.initHeight = true;
    if (url.includes('newPassword') || url.includes('registration') || url.includes('workflow')
      || url.includes('isRegister')) {
      if (url.includes('newPassword')) {
        this.generalService.setUserName(url);
        this.isNewPassword = true;
        this.spinnerService.hide('appSpinner');
        this.router.navigate(['newPassword'], { queryParams: null });
        return;
      } else if (url.includes('registration')) {
        this.isRegistration = true;
        this.spinnerService.hide('appSpinner');
        this.router.navigate(['registration'], { queryParams: null });
        return;
      } else if (url.includes('workflow')) {
        this.generalService.setRequestNum(url);
        this.isWorkflow = true;
        this.router.navigate(['workflow'], { queryParams: null });
        return;
      } else {
        this.isNewPassword = false;
        this.isRegistration = false;
      }
    }



    this.subscription = this.generalService.spinnerToggle.subscribe((value) => {
      if (value === false) {
        this.initHeight = false;
      }
    });

    this.getJSONData();

    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        if (event.url && event.url.indexOf('registration') > -1) {
          this.isLeftNavRequired = false;
        }
        if (event && event.id === 1) {
          const params = event.state.root.firstChild.queryParams;
          this.spinnerService.hide('appSpinner');
          if (params && params['changePwdApplicable']) {
            if (params['changePwdApplicable'] === 'true') {
              this.generalService.isForcePassword = true;
              const _params = Object.assign({}, params);
              delete _params['changePwdApplicable'];
              this.router.navigate(['/ChangePassword'], { queryParams: _params });
            } else {
              setTimeout(() => {
                this.spinnerService.show('appSpinner');
              });
              const _params = Object.assign({}, params);
              delete _params['changePwdApplicable'];
              this.getDashBoardData();
            }
          } else {
            setTimeout(() => {
              this.spinnerService.show('appSpinner');
            });
            const _params = Object.assign({}, params);
            delete _params['changePwdApplicable'];
            this.getDashBoardData();
          }
        }
      }
      if (event instanceof NavigationEnd) {
        this.isPadding = true;
        if (event.url && event.url.indexOf('Accounts') > -1) {
          this.isPadding = false;
        }
      }
    });
    this.subscription1 = this.generalService.dashboardData.subscribe(resp => {
      if (resp) {
        setTimeout(() => {
          this.spinnerService.show('appSpinner');
        });
        this.getDashBoardData();
      }
    });

  }

  getDashBoardData() {
    // this.generalService.setUrl();
    this.generalService.getPasswordDetails().pipe(
      map(resp => {
        this.userId = resp['id'];
        this.generalService.userId = resp['id'];
        this.generalService.userInfoData = resp;
        if(resp.properties['rolePartitionMappedWithUser']) {
          this.generalService.partitonNameMappedToUser = resp.properties['rolePartitionMappedWithUser'];
        }
        return resp;
      }),
      switchMap(resp => {
        return this.generalService.getDashboardData()
      })
    ).subscribe((resp: any) => {
      const dashBoardAPiData: DashboardList = resp[0];
      const toolBarData: Array<Toolbar> = resp[1];
      this.generalService.jsonConstants = resp[2];
      this.generalService.toolBarArray = toolBarData;
      const menuImagesData = resp[2].menuImages;
      this.setAccessPriviligesData(toolBarData);
      if (resp) {
        this.startTimer();
        const systemProperties = [...dashBoardAPiData['systemProprties']];
        this.generalService.systemProperties = systemProperties;
        this.images = this.mapImageData(toolBarData, menuImagesData);
        this.images.sort((a, b) => {
          return a.tolBarOrderNum - b.tolBarOrderNum;
        });
        const routePath = (this.images[0].toolBarName).replace(/ /g, '');
        this.router.navigate([routePath]);
        const perPageCount = systemProperties.filter(obj => obj.propertyName === 'perPageCount')[0]['propertyValues'];
        this.settingsService.PER_PAGE_COUNT = Number(perPageCount);
        this.headerProperties = dashBoardAPiData;
        this.generalService.headerProperties = dashBoardAPiData;
        this.generalService.widgetData.next(dashBoardAPiData);
      }
    }, err => {
      this.toastr.error(ErrorMessages.DASHBOARD_ERR_MSG);
      this.spinnerService.hide('appSpinner');
    });

  }

  mapImageData(toolBarData, menuImagesData) {
    toolBarData.forEach(toolBar => {
      if (menuImagesData && menuImagesData[toolBar.toolBarName.toLowerCase()]) {
        toolBar.imageUrl = menuImagesData[toolBar.toolBarName.toLowerCase()];
        if (toolBar.toolBarItems && toolBar.toolBarItems.length) {
          toolBar.toolBarItems.forEach(item => {
            if (menuImagesData && menuImagesData[item.toolBarItemName.toLowerCase()]) {
              item.imageUrl = menuImagesData[item.toolBarItemName.toLowerCase()];
            }
          });
        }
      }
    });
    return toolBarData;
  }

  private getJSONData() {
    this.generalService.getCurrencies().subscribe((currencies: []) => {
      this.generalService.currencies = currencies;
    });
  }

  private logout() {
    let url = '';
    if (!environment.production) {
      url = 'http://localhost:8090/partnerportalv3/sparkLogout.html';
    } else {
      const href: string = window.location.href;
      const path = this.appUtils.generateDynamicUrl(href);
      const host = window.location.host;
      const protocol = this.settingsService.applicationProperties['protocol'];
      url = `${protocol}://${host}/${path}/sparkLogout.html`;
    }
    location.assign(url);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
  }

  setAccessPriviligesData(toolBarData) {
    const screenActionMap: Map<string, Array<string>> = new Map();
    toolBarData.forEach(element => {
      if (element.toolBarItems && element.toolBarItems.length) {
        element.toolBarItems.forEach(item => {
          if (!screenActionMap.has(item.toolBarItemName)) {
            screenActionMap.set(item.toolBarItemName, item.actions);
          }
        });
      }
    });
    this.generalService.accessPriviligesData = screenActionMap;
  }

  startTimer() {
    if (!ApiConfigService.authProperties["standaloneMode"]) {
      this.userIdleService.setConfigValues({ idle: 1, timeout: 5, ping: 30 })
      this.userIdleService.startWatching();
      this.userIdleService.onTimerStart().subscribe(count => void (0));
      //loading application now
      this.userIdleService.onTimeout().subscribe(() => {
        this.userIdleService.resetTimer();
        this.applicationHttpClient.checkServer().subscribe((data: any) => {
          if (data.status !== 'Success') {
            window.parent.alert("Session Expired. Closing the window");
            this.logout();
            window.parent.close();
          }
        },
          error => {
            console.log(error);
            window.parent.alert("Session Expired. Closing the window");
            this.logout();
            window.parent.close();
          });
      }
      );
    }
  }

}
