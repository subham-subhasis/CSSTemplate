import { Injectable, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { DashboardList } from '../models/dashboard.model';
import { BillModel } from '../models/bill.model';
import { BillTotal } from '../models/billTotal.model';
import { DisputeModel } from '../models/dispute.model';
import { CreditNote } from '../models/credit-note.model';
import { BillChartModel } from '../models/billchart.model';
import { RequestEndPoint } from '../models/reqEndPoint.interface';
import { environment } from 'src/environments/environment';
import { AppUtils } from 'src/app/utils/app.util';
import { SettingsService } from 'src/app/services/settings.service';
import { map, switchMap } from 'rxjs/operators';
import { ToolBar } from '../../root/models/toolbar.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  billId = new BehaviorSubject<number>(0);
  toggleWidth = new BehaviorSubject<any>('');
  widgetData = new BehaviorSubject<any>('');
  spinnerToggle = new BehaviorSubject<any>('');
  dashboardData = new BehaviorSubject<any>('');
  selectedBillProfile = '';
  headerPanel: ElementRef;
  dashboardUrl = '';
  commonUrl = '';
  auditUrl = '';
  changePwdUrl = '';
  toolBarUrl = ''
  currencies = [];
  disputeCurrCode: any;
  systemProperties = [];
  headerProperties = {};
  userAccountsData = [];
  userBillProfilesArray = [];
  isForcePassword = false;
  userNameFromUrl = '';
  requestNumber = '';
  userInfoData = {} as any;
  jsonConstants = {} as any;
  toolBarArray = [];
  private _partitonNameMappedToUser = '';
  get partitonNameMappedToUser() {
    return this._partitonNameMappedToUser;
  }
  set partitonNameMappedToUser(value: string) {
    this._partitonNameMappedToUser = value;
  }
  private _userId = 0;
  set userId(value: number) {
    this._userId = value;
  }
  get userId() {
    return this._userId;
  }
  private _accessPriviligesData: Map<string, Array<string>> = {} as any;
  set accessPriviligesData(value: any) {
    this._accessPriviligesData = value;
  }
  get accessPriviligesData() {
    return this._accessPriviligesData;
  }
  constructor(private httpClient: HttpClient, private appUtil: AppUtils, private settingService: SettingsService) {
  }
  setUrl() {
    if (!environment.production) {
      this.dashboardUrl = 'http://127.0.0.1:8090/PartnerManagement/ppservices/dashboard/'
        + 'home?userName=Root&password=welcome1';
      this.toolBarUrl = 'http://127.0.0.1:8090/PartnerManagement/ppservices/dashboard/'
        + 'roleaccessprivillages?userName=Root&password=welcome1&applicationType=PCP';
      this.commonUrl = 'http://127.0.0.1:8090/PartnerManagement/ppservices/common/request/?' +
        'userName=Root&password=welcome1';
      this.changePwdUrl = 'http://127.0.0.1:8090/PartnerManagement/ppservices/changePassword?userName=Root&password=welcome1';
      this.auditUrl = 'http://127.0.0.1:8090/PartnerManagement/ppservices/audits/audit?userName=Root&password=welcome1';
    } else {
      const href: string = window.location.href;
      const path = this.appUtil.generateDynamicUrl(href);
      const host = window.location.host;
      const protocol = this.settingService.applicationProperties['protocol'];

      // this.dashboardUrl = 'http +://' + host + '/' + path + '/ppservices/dashboard/home';
      this.dashboardUrl = `${protocol}://${host}/${path}/ppservices/dashboard/home`;
      this.toolBarUrl = `${protocol}://${host}/${path}/ppservices/dashboard/roleaccessprivillages?applicationType=PCP`;
      this.commonUrl = `${protocol}://${host}/${path}/ppservices/common/request`;
      this.changePwdUrl = `${protocol}://${host}/${path}/ppservices/changePassword`;
      this.auditUrl = `${protocol}://${host}/${path}/ppservices/audits/audit`;
    }
  }

  isExternal() {
    if (this.userInfoData && this.userInfoData.properties && this.userInfoData.properties['Is External'] && this.userInfoData.properties['Is External'] == 'true') {
      return true;
    }
    return false;
  }
  setUserName(urlVal: string) {
    let userName = '';
    const arrVal = urlVal.split(':');
    if (arrVal && arrVal.length > 0) {
      userName = arrVal[1];
    }
    this.userNameFromUrl = userName;
  }

  getUserName(): string {
    return this.userNameFromUrl;
  }

  getScreenActions(screenName) {
    const actionObj = {};
    if (this._accessPriviligesData.has(screenName)) {
      const screenActions = this._accessPriviligesData.get(screenName);
      screenActions.forEach(element => {
        actionObj[element.toLowerCase()] = true;
      });
    }
    return actionObj;
  }

  setRequestNum(urlVal: string) {
    let userName = '';
    const index = urlVal.search('/workflow');
    userName = urlVal.substring(index + '/workflow'.length);
    this.requestNumber = userName;
  }

  getRequestNum(): string {
    return this.requestNumber;
  }

  setSelectedBillProfile(billProfile: string) {
    this.selectedBillProfile = billProfile;
  }

  getPasswordDetails(): Observable<any> {
    if (this.settingService.applicationProperties) {
      return this.httpClient.get<any>(this.changePwdUrl);
    } else {
      return this.settingService.setLanguage().pipe(
        switchMap(resp => {
          this.setUrl();
          return this.httpClient.get<any>(this.changePwdUrl);
        })
      );
    }

  }

  getSelectedBillProfile() {
    return this.selectedBillProfile;
  }

  getDashboardData(): any {
    if (this.settingService.applicationProperties) {
      return forkJoin([this.httpClient.get<DashboardList>(this.dashboardUrl),
      this.httpClient.get<Array<ToolBar>>(this.toolBarUrl), this.httpClient.get('./assets/json/constants.json')]);
    }
    else {
      return this.settingService.setLanguage().pipe(
        switchMap(resp => {
          this.setUrl();
          return forkJoin([this.httpClient.get<DashboardList>(this.dashboardUrl),
          this.httpClient.get<Array<ToolBar>>(this.toolBarUrl), this.httpClient.get('./assets/json/constants.json')]);
        })
      );
    }
  }

  getBillList() {
    const objToSend = new RequestEndPoint();
    objToSend.setRequestEndpoint('BillList');
    objToSend.setRequestParam({
      'screenName': 'Dashboard',
      'actionName': 'Search'
    });
    return this.httpClient.post<BillModel[]>(this.commonUrl, objToSend, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(resp => {
        if (resp && Array.isArray(resp) && resp.length) {
          this.userBillProfilesArray = resp;
        }
        return resp;
      })
    );
  }

  getBillData(billId: number) {
    const objToSend = new RequestEndPoint();
    objToSend.setEntityId(JSON.stringify(billId));
    objToSend.setRequestEndpoint('BillAmountComponent');
    objToSend.setRequestParam({
      'screenName': 'Dashboard',
      'actionName': 'Search'
    });
    return this.httpClient.post<BillTotal>(this.commonUrl, objToSend, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getDisputeData(billId: number) {
    const objToSend = new RequestEndPoint();
    objToSend.setEntityId(JSON.stringify(billId));
    objToSend.setRequestEndpoint('DisputeAmountComponent');
    objToSend.setRequestParam({
      'screenName': 'Dashboard',
      'actionName': 'Search'
    });
    return this.httpClient.post<DisputeModel>(this.commonUrl, objToSend, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getAccountsList() {
    return this.createRequest('AccountList', {}).subscribe(rsep => {
      const accData: Array<any> = [];
      if (rsep && Array.isArray(rsep) && rsep.length) {
        rsep.forEach(item => {
          accData.push({ label: item.paccName, isSelected: false, value: item.paccId, details: item });
        });
        this.userAccountsData = accData;
      } else {
        this.userAccountsData = [];
      }

    }, err => {
      this.userAccountsData = [];
    });

  }

  getAccountsListMap() {
    return this.createRequest('AccountList', {}).pipe(
      map(rsep => {
        const accData: Array<any> = [];
        if (rsep && Array.isArray(rsep) && rsep.length) {
          rsep.forEach(item => {
            accData.push({ label: item.paccName, isSelected: false, value: item.paccId, details: item });
          });
          this.userAccountsData = accData;
        } else {
          this.userAccountsData = [];
        }
        return true;
      }, err => {
        this.userAccountsData = [];
      })
    )

  }

  private createRequest(endPoint: string, requestObj?: any) {
    const objToSend = new RequestEndPoint();
    objToSend.setRequestEndpoint(endPoint);
    objToSend.setRequestParam(requestObj);
    return this.sendRequest(objToSend);
  }


  private sendRequest(objToSend: RequestEndPoint) {
    return this.httpClient.post<any>(this.commonUrl, objToSend, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getBillViewData(billId: number) {
    const objToSend = new RequestEndPoint();
    objToSend.setEntityId(JSON.stringify(billId));
    objToSend.setRequestEndpoint('BillViewComponent');
    objToSend.setRequestParam({
      'screenName': 'Dashboard',
      'actionName': 'Search'
    });
    return this.httpClient.post<BillChartModel[]>(this.commonUrl, objToSend, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getCreditNotes(billId: number) {
    const objToSend = new RequestEndPoint();
    objToSend.setEntityId(JSON.stringify(billId));
    objToSend.setRequestEndpoint('CreditNotesComponent');
    objToSend.setRequestParam({
      'screenName': 'Dashboard',
      'actionName': 'Search'
    });
    return this.httpClient.post<CreditNote[]>(this.commonUrl, objToSend, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  public getCurrencies() {
    return this.httpClient.get('./assets/currencies/Common-Currency.json');
  }

  saveChangedPassword(curPwd: string, newPwd: string, confirmPwd: string) {
    this.setUrl();
    const objToSend = {
      'currentPassword': curPwd,
      'usrPassword': newPwd,
      'confirmPassword': confirmPwd
    };
    return this.httpClient.post<any>(this.changePwdUrl, objToSend, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
