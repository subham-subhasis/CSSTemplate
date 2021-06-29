import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationStrategy } from '@angular/common';
import { AppUtils } from 'src/app/utils/app.util';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  elementUrl = 'assets/elements/onBoarding/custom-element-es2015.js';
  userId: number;
  constructor(private spinnerService: NgxSpinnerService, private generalService: GeneralService, private location: LocationStrategy, private appUtils: AppUtils) { }

  ngOnInit() {
    this.userId = this.generalService.userId;
    this.appUtils.disableStyle('account-management-styles.css');
    this.location.onPopState(() => {
      const path = this.location.path();
      if (path.indexOf('registration') > -1 || path.indexOf('isRegister') > -1) {
        let url = '';
        const href: string = location.href;
        const path = this.generateDynamicUrl(href);
        const host = location.host;
        url = 'http://' + host + '/' + path + '/sparkLogout.html';
        location.href = url;
      }
      return false;
    });
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'assets/elements/onBoarding/elementstyles.css';
    link.media = 'all';
    head.appendChild(link);
    setTimeout(() => {
      this.spinnerService.hide('appSpinner');
    });
  }

  public generateDynamicUrl(href: string) {
    let path = '';
    // tslint:disable-next-line: variable-name
    const split_one = href.split(':');
    const split2 = split_one[split_one.length - 1].split('/');
    if (split2.length > 0) {
      path = split2[1];
    }
    return path;
  }

  ngOnDestroy() {
    this.appUtils.enableStyle('account-management-styles.css');
    this.appUtils.disableStyle('elementstyles.css');
  }

}
