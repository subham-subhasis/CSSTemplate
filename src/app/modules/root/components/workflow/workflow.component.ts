import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { RootService } from '../../services/root-service.service';
import { AppUtils } from 'src/app/utils/app.util';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit, OnDestroy {
  requestId = '';
  greetings = '';
  userName = '';
  teams = [];
  dynamicWidth = '';
  partnerInfo = {} as any;

  constructor(private translate: TranslateService, private generalService: GeneralService, private location: LocationStrategy, private router: Router, private rootSvc: RootService, private appUtils: AppUtils) { }

  ngOnInit() {
    this.appUtils.disableStyle('account-management-styles.css');
    this.loadGreetings();
    let encryptedRegId = this.generalService.getRequestNum();

    if (encryptedRegId && encryptedRegId.length > 0) {
      encryptedRegId = encryptedRegId.substr(1);
      this.requestId = window.atob(encryptedRegId);
      this.location.onPopState(() => {
        const path = this.location.path();
        if (path.indexOf('workflow') > -1 || path.indexOf('workflow') > -1) {
          let url = '';
          const href: string = location.href;
          const path = this.generateDynamicUrl(href);
          const host = location.host;
          url = 'http://' + host + '/' + path + '/sparkLogout.html';
          location.href = url;
        }
        return false;
      });
      this.getWorkflowDetails();
    } else {
      this.router.navigate(['404'], { queryParams: null });
    }
  }
  getWorkflowDetails() {
    forkJoin([this.rootSvc.getConstantsJson(), this.rootSvc.getPartnerInfos(this.requestId)]).subscribe((resp: any) => {
      this.teams = resp[0].workflowTeams;
      const partnerData = resp[1];
      this.partnerInfo = partnerData[0];
      const width = 100 / this.teams.length;
      let isActiveSet = false;
      this.teams.forEach(element => {
        if (this.partnerInfo && this.partnerInfo.status === 'active') {
          element.isCompleted = true;
        } else {
          if (this.partnerInfo.workStepTeam && element.name.toLowerCase().indexOf(this.partnerInfo.workStepTeam.toLowerCase()) > -1) {
            element.isActive = true;
            isActiveSet = true;
          }
          if (!isActiveSet) {
            element.isCompleted = true;
          }
        }

      });
      //this.teams[0].isActive = true;
      //this.teams[1].isCompleted = false;

      this.dynamicWidth = `${width}%`;
      this.userName = this.getUserName(this.partnerInfo.infoData);
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

  routeTologin() {
    let url = '';
    const href: string = location.href;
    const path = this.generateDynamicUrl(href);
    const host = location.host;
    url = 'http://' + host + '/' + path + '/sparkLogout.html';
    location.href = url;
  }

  getUserName(infoData: Array<any>) {
    if (infoData && infoData.length) {
      const firstname = infoData.filter(a => a.dfnName.toLowerCase() === 'first name')[0];
      const lastname = infoData.filter(a => a.dfnName.toLowerCase() === 'last name')[0];
      return `${firstname.dfnVal} ${lastname.dfnVal}`;
    }
    return '';
  }

  loadGreetings() {
    const myDate = new Date();
    const hrs = myDate.getHours();
    if (hrs < 12) {
      this.translate.get('GREETING.MORNING').subscribe((value) => {
        this.greetings = value;
      });
    } else if (hrs >= 12 && hrs <= 17) {
      this.translate.get('GREETING.AFTERNOON').subscribe((value) => {
        this.greetings = value;
      });
    } else if (hrs >= 17 && hrs <= 24) {
      this.translate.get('GREETING.EVENING').subscribe((value) => {
        this.greetings = value;
      });
    }
  }

  ngOnDestroy() {
    this.appUtils.enableStyle('account-management-styles.css');
    this.appUtils.disableStyle('elementstyles.css');
  }

}
