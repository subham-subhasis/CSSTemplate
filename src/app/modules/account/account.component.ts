import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from 'src/app/config.service';
import { AppUtils } from 'src/app/utils/app.util';
import { GeneralService } from '../dashboard/services/general.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  elementUrl = 'assets/elements/accounts/account-management-es2015.js';
  constructor(private spinnerService: NgxSpinnerService,
              private generalService: GeneralService) { }
  userAccountsData = [];
  userBillProfileData = [];
  userId = 0;
  userPartitionName = '';
  acctIds = '';
  billProfIds = '';
  isExternal =  false;
  userName = '';
  screenActions = {};
  ngOnInit() {
    this.screenActions = this.generalService.getScreenActions('Manage Account');
    this.userAccountsData = this.generalService.userAccountsData;
    this.userPartitionName = this.generalService.partitonNameMappedToUser;
    const acctIdArray = this.userAccountsData.map(a => a.value);
    this.acctIds = acctIdArray.toString();
    this.userId = this.generalService.userId;
    this.userBillProfileData = this.generalService.userBillProfilesArray;
    const billProfIdArray = this.userBillProfileData.map(a => a.pbipId);
    this.billProfIds = billProfIdArray.toString();
    this.userName = this.generalService.headerProperties['userName'];
    this.isExternal = this.generalService.isExternal();
    this.spinnerService.hide('widgetSpinner');
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.type = 'text/css';
    // // link.href = './assets/elements/accounts/account-management-styles.css';
    // link.media = 'all';
    // head.appendChild(link);
    setTimeout(() => {
      this.spinnerService.hide('appSpinner');
    });
  }

  ngOnDestroy() {
    // this.appUtils.enableStyle('styles.css');
    // this.appUtils.disableStyle('account-management-styles.css');
  }

}
