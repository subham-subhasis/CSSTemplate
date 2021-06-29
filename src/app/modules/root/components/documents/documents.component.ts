import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppUtils } from 'src/app/utils/app.util';
import { GeneralService } from '../../../dashboard/services/general.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  elementUrl = 'assets/elements/accounts/account-management-es2015.js';
  isExternal =  false;
  userAccountsData = [];
  acctIds = '';
  userName = '';
  userPartitionName = '';
  userId = 0;
  screenActions = {};
  constructor(private generalService: GeneralService,
              private spinnerService: NgxSpinnerService,
              private appUtils: AppUtils) { }

  ngOnInit() {
    this.screenActions = this.generalService.getScreenActions('Manage Documents');
    this.userAccountsData = this.generalService.userAccountsData;
    this.userPartitionName = this.generalService.partitonNameMappedToUser;
    const acctIdArray = this.userAccountsData.map(a => a.value);
    this.acctIds = acctIdArray.toString();
    this.userId = this.generalService.userId;
    this.userName = this.generalService.headerProperties['userName'];
    this.isExternal = this.generalService.isExternal();
    this.spinnerService.hide('widgetSpinner');
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.type = 'text/css';
    // link.href = './assets/elements/accounts/account-management-styles.css';
    // link.media = 'all';
    // head.appendChild(link);
    setTimeout(() => {
      this.spinnerService.hide('appSpinner');
    });
  }

  ngOnDestroy() {
  }

}
