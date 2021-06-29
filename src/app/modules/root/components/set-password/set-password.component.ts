import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { AppUtils } from 'src/app/utils/app.util';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit, OnDestroy {
  elementUrl = 'assets/elements/onBoarding/custom-element-es2015.js';
  userNameToElement = '';
  userId: number;
  constructor(private generalService: GeneralService, private location: LocationStrategy, private router: Router, private appUtils: AppUtils) {
  }

  ngOnInit() {
    this.userId = this.generalService.userId;
    this.appUtils.disableStyle('account-management-styles.css');
    this.userNameToElement = this.generalService.getUserName();
    if (this.userNameToElement && this.userNameToElement.length > 0) {
      //this.userNameToElement =  this.userNameToElement.substr(1);
      this.location.onPopState(() => {
        const path = this.location.path();
        if (path.indexOf('newPassword') > -1 || path.indexOf('newPassword') > -1) {
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
    } else {
      this.router.navigate(['404'], { queryParams: null });
    }
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
