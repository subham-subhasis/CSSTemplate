import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RootService } from 'src/app/modules/root/services/root-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from 'src/app/services/settings.service';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { ActivityRequest } from '../../models/request.model';
import { AppUtils } from 'src/app/utils/app.util';
import { ToastrService } from 'ngx-toastr';
import { SlideInOutAnimation } from './animation';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
  animations: [SlideInOutAnimation],
  encapsulation: ViewEncapsulation.None
})
export class ActivityLogComponent implements OnInit, OnDestroy {
  headerColumns = {
    'ACTIVITY.USER_NAME': { field: 'usrName', subField: '', header: 'User Name', columnCount: 1, check: true, isFilterRequired: false, isActive: false, width: '15%' },
    'ACTIVITY.SCREEN_NAME': { field: 'scrName', subField: '', header: 'Screen Name', columnCount: 2, check: true, isFilterRequired: true, isActive: false, width: '20%' },
    'ACTIVITY.ACTION': { field: 'actionName', subField: '', header: 'Action', columnCount: 3, check: true, isFilterRequired: true, isActive: false, width: '20%' },
    'ACTIVITY.STATUS': { field: 'atrStatus', subField: '', header: 'Status', columnCount: 4, check: true, isFilterRequired: true, isActive: false, width: '15%' },
    'ACTIVITY.AUDIT_DATE': { field: 'atrDttm', subField: '', header: 'Audit Date', columnCount: 5, check: true, isFilterRequired: false, isActive: false, width: '30%' }
  };
  allColumns = [];
  auditPopHeaders = { };
  statusList = [{ label: 'Success', isChecked: false }, { label: 'Failure', isChecked: false }];
  auditActionMap = {};
  actionList = [];
  acitivityLogData: any[];
  labelList = new Map();
  screenNameList = [];
  filterValues = [];
  totalCount = 0;
  per_page_count = 0;
  startIndex = 0;
  dateRange = 0;
  isLastFilter = false;
  reqObj: ActivityRequest = { pageNum: 0, pageSize: this.per_page_count, actionFlt: '', fromDttm: null, screenNameFlt: '', searchText: '', statusFlt: '', toDttm: null };
  fromDate: Date;
  toDate: Date;
  searchText = '';
  filterKeys = [];
  displayFilterKeys = [];
  isFilterVisible = false;
  isGlobalSearch = true;
  popoverKeys = [];
  popoverData = {};
  localeProperties = {};
  searchFilterText = '';

  constructor(private rootService: RootService, private spinnerService: NgxSpinnerService, private settingsService: SettingsService, private generalService: GeneralService, private appUtils: AppUtils, private toastrService: ToastrService, private datePipe: DatePipe, private translate: TranslateService) { }

  ngOnInit() {
    this.localeProperties = this.settingsService.properties;
    this.labelList = this.generalService.accessPriviligesData;
    this.auditPopHeaders = this.generalService.jsonConstants['activityLogPopoverLabels'];
    this.auditActionMap = this.generalService.jsonConstants['auditActions'];
    //const data = this.generalService.headerProperties;
    //this.labelList = data['toolbarList'];
    this.per_page_count = this.settingsService.PER_PAGE_COUNT;
    this.reqObj.pageSize = this.per_page_count;
    this.translate.get(Object.keys(this.headerColumns))
      .subscribe(translations => {
        // tslint:disable-next-line: forin
        for (const key in translations) {
          this.headerColumns[key].header = translations[key];
          this.allColumns.push(this.headerColumns[key]);
        }
      });
    this.fetchScreenNames();
    // setTimeout(() => {
    //   this.spinnerService.show('auditPageSpinner');
    // });
    this.getAuditData();
  }

  getAuditData() {
    setTimeout(() => {
      this.spinnerService.show('auditTableSpinner');
    });
    this.rootService.getAuditData(this.reqObj).subscribe((data: any) => {
      this.spinnerService.hide('auditPageSpinner');
      this.spinnerService.hide('auditTableSpinner');
      if (data && data.length) {
        this.totalCount = data[0].totalRowCount;
        this.acitivityLogData = data;
        this.acitivityLogData.map(x => {
          x.atrDttm = this.datePipe.transform(x.atrDttm, this.localeProperties['dateTimeFormat'], '', this.localeProperties['locale']);
          return x;
        });
      } else {
        this.totalCount = 0;
        this.acitivityLogData = [];
      }
    },
      (error) => {
        this.spinnerService.hide('auditPageSpinner');
        this.spinnerService.hide('auditTableSpinner');
      });
  }

  onactionDetailsPopover(activitydata) {
    if (activitydata && activitydata.atrCurObject) {
      this.popoverData = activitydata;
      this.popoverKeys = Object.keys(this.popoverData['atrCurObject']);
    }
  }

  onArrowClick(type: string) {
    if (type === 'next') {
      this.reqObj.pageNum = this.reqObj.pageNum + this.per_page_count;
      if (this.reqObj.pageNum > this.totalCount) {
        this.reqObj.pageNum = this.reqObj.pageNum - this.per_page_count;
        return;
      }
    } else {
      if (this.reqObj.pageNum === 0) { return; }
      if (this.reqObj.pageNum > this.per_page_count || this.reqObj.pageNum === this.per_page_count) {
        this.reqObj.pageNum = this.reqObj.pageNum - this.per_page_count;
      } else {
        this.reqObj.pageNum = 0;
      }
    }
    this.getAuditData();
  }

  onFilterSelection(filterItem) {
    this.resetActiveFilter();
    this.searchFilterText = '';
    filterItem.isActive = true;
    const filterlabel = filterItem.header ? filterItem.header.toLowerCase().replace(/ +/g, '') : '';
    if (filterlabel === 'screenname') {
      this.filterValues = this.screenNameList;
    } else if (filterlabel === 'status') {
      this.filterValues = this.statusList;
    } else if (filterlabel === 'action') {
      this.actionList = [];
      let isScreenSelected = false;
      this.screenNameList.forEach(scrn => {
        if (scrn.isChecked){
          isScreenSelected =  true;
          const screenName = scrn.label.toLowerCase();
          this.actionList = [...this.actionList,...this.auditActionMap[screenName]];
        }
      });
      if(!isScreenSelected){
        this.screenNameList.forEach(scrn => {
          const screenName = scrn.label.toLowerCase();
          this.actionList = [...this.actionList,...this.auditActionMap[screenName]];
        });
      }
      this.filterValues = this.actionList;
    }
  }
  resetActiveFilter() {
    this.allColumns.forEach(header => {
      header.isActive = false;
    });
  }

  fetchScreenNames() {
    if (this.labelList && this.labelList.size) {
      this.labelList.forEach((value: any, key: string) => {
        if (key.toLowerCase() !== 'activity log' && key.toLowerCase() !== 'dashboard') {
          this.screenNameList.push({ label: key, isChecked: false });
        }
      });
    }
  }

  onSearch() {
    setTimeout(() => {
      this.spinnerService.show('disputeTableSpinner');
    });
    this.reqObj.pageNum = 0;
    this.reqObj.searchText = this.searchText;
    this.reqObj.actionFlt = '';
    this.reqObj.screenNameFlt = '';
    this.reqObj.statusFlt = '';
    this.getAuditData();
  }

  getDateFromMillis(date) {
    return Number(date);
  }


  onReset() {
    this.fromDate = null;
    this.toDate = null;
    this.searchText = '';
    setTimeout(() => {
      this.spinnerService.show('disputeTableSpinner');
    });
    this.reqObj.pageNum = 0;
    this.reqObj.searchText = this.searchText;
    if (this.reqObj.actionFlt || this.reqObj.actionFlt.toString() === '') { delete this.reqObj['actionFlt']; }
    if (this.reqObj.screenNameFlt || this.reqObj.screenNameFlt.toString() === '') { delete this.reqObj['screenNameFlt']; }
    if (this.reqObj.statusFlt || this.reqObj.statusFlt.toString() === '') { delete this.reqObj['statusFlt']; }
    if (this.reqObj.fromDttm) { delete this.reqObj['fromDttm']; }
    if (this.reqObj.toDttm) { delete this.reqObj['toDttm']; }

    this.statusList.forEach(stat => {
      stat.isChecked = false;
    });
    this.actionList.forEach(act => {
      act.isChecked = false;
    });
    this.screenNameList.forEach(screen => {
      screen.isChecked = false;
    });
    this.resetActiveFilter();
    this.getAuditData();
  }

  monthDiff(d1: Date, d2: Date) {
    let months = 0;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  prepareDateFilterData() {
    this.reqObj.pageNum = 0;
    this.reqObj.actionFlt = '';
    this.reqObj.screenNameFlt = '';
    this.reqObj.statusFlt = '';
    this.reqObj.searchText = this.searchText;
    const diff = this.dateRange;
    const fromDate = new Date(this.fromDate);
    const toDate = new Date(this.toDate);
    if (this.fromDate && !this.toDate) {
      this.toastrService.error('Please select To date');
      return;
    }
    if (this.toDate && !this.fromDate) {
      this.toastrService.error('Please select From date');
      return;
    }
    if (this.fromDate && this.toDate) {
      if (toDate.getTime() < fromDate.getTime()) {
        this.toastrService.error('To date should be greater than from date');
        return;
      }
      if (this.monthDiff(fromDate, toDate) > diff) {
        this.toastrService.error('Allowed range is ' + diff + ' months');
        return;
      }
    }

    if (this.fromDate && this.toDate) {
      let dateValues = {};
      dateValues = this.appUtils.filterDate(this.toDate, this.fromDate);
      this.reqObj.toDttm = dateValues['modifiedToDate'] ? new Date(dateValues['modifiedToDate']).getTime() : 0;
      this.reqObj.fromDttm = dateValues['modifiedFromDate'] ? new Date(dateValues['modifiedFromDate']).getTime() : 0;
    }

    if (this.statusList && this.statusList.length) {
      const temp = this.statusList.filter(a => a.isChecked === true);
      this.reqObj.statusFlt = temp && temp.length ? temp.map(a => a.label).toString() : '';
    }
    if (this.actionList && this.actionList.length) {
      const temp = this.actionList.filter(a => a.isChecked === true);
      this.reqObj.actionFlt = temp && temp.length ? temp.map(a => a.label).toString() : '';
    }
    if (this.screenNameList && this.screenNameList.length) {
      const temp = this.screenNameList.filter(a => a.isChecked === true);
      this.reqObj.screenNameFlt = temp && temp.length ? temp.map(a => a.label).toString() : '';
    }

  }

  onFilterButtonSearch() {
    this.prepareDateFilterData();
    this.getAuditData();
  }

  ngOnDestroy() {
  }


}
