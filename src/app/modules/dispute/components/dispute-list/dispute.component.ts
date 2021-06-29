import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { DisputeService, DropFilter } from '../../services/dispute.service';
import { AppUtils } from 'src/app/utils/app.util';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from 'src/app/services/settings.service';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DisputeComponent implements OnInit, AfterViewInit {
  filterKeys = [];
  displayFilterKeys = [];
  filterValues = {};
  fromDate: Date;
  isAuthorizedBool = true;
  dateRange = 0;
  toDate: Date;
  searchText = '';
  searchFilterText = '';
  totalCount = 0;
  isAdmin = true;
  localeProperties: any;
  per_page_count = 0;
  isFilterVisible = false;
  isCreateDispVisible = false;
  isGlobalSearch = true;
  disablePinning = false;
  allColumns = [];
  scrollableCols: any[];
  frozenCols: any[];
  scrollableColumn: any = {};
  screenActions = {};
  @ViewChild('filterDD', { static: false }) filterDD: ElementRef;
  @ViewChild('filterDrop', { static: false }) filterDrop: ElementRef;
  filterData: { [key: string]: DropFilter } = {};
  headerList = {
    'DISPUTE.ACTION': { field: 'action', header: 'Action', subField: '', columnCount: 1, check: true, isFilterRequired: false, isActive: false, width: 125 },
    'DISPUTE.ACCOUNT': { field: 'accountName', header: 'Account', subField: '', columnCount: 2, check: true, isFilterRequired: true, isActive: false, width: 180 },
    'DISPUTE.BILLPROFILE': { field: 'billProfileName', header: 'Bill Profile', subField: '', columnCount: 3, check: true, isFilterRequired: true, isActive: false, width: 180 },
    'DISPUTE.FROM': { field: 'disputeFromDate', header: 'From', subField: '', columnCount: 4, check: false, isFilterRequired: false, isActive: false, width: 125 },
    'DISPUTE.TO': { field: 'disputeToDate', header: 'To', subField: '', columnCount: 5, check: false, isFilterRequired: false, isActive: false, width: 125 },
    'DISPUTE.DISPUTE_TYPE': { field: 'disputeTypeCode', header: 'Dispute Type', subField: '', columnCount: 6, check: false, isFilterRequired: false, isActive: false, width: 200 },
    'DISPUTE.STATUS': { field: 'statusDisplay', header: 'Status', subField: '', columnCount: 7, check: false, isFilterRequired: true, isActive: false, width: 125 },
    'DISPUTE.REASON': { field: 'disputeReason', header: 'Dispute Reason', subField: '', columnCount: 8, check: false, isFilterRequired: false, isActive: false, width: 180 },
    'DISPUTE.AMOUNT': { field: 'disputeAmt', header: 'Dispute Amount', subField: '', columnCount: 9, check: false, isFilterRequired: false, isActive: false, width: 180 },
    'DISPUTE.CREATED_DATE': { field: 'disputeCreatedDate', header: 'Created Date', subField: '', columnCount: 10, check: false, isFilterRequired: false, isActive: false, width: 180 },
    'DISPUTE.AMT_FAV_PARTNER': { field: 'disputeResolvedAmountFavoringOtherOperator', header: 'Amount Favouring Partner', subField: '', columnCount: 11, check: false, isFilterRequired: false, isActive: false, width: 200 },
    'DISPUTE.AMT_FAV_HOM_CARRIER': { field: 'disputeResolvedAmountFavoringCarrier', header: 'Amount Favoring Home Carrier', subField: '', columnCount: 12, check: false, isFilterRequired: false, isActive: false, width: 200 },
    'DISPUTE.RAISED_BY': { field: 'disputeCreatedUsrName', header: 'Raised By', subField: '', columnCount: 13, check: false, isFilterRequired: false, isActive: false, width: 180 },
    'DISPUTE.CURRENCY': { field: 'currency', header: 'Currency', subField: 'currencyCode', columnCount: 14, check: false, isFilterRequired: false, isActive: false, width: 125 }
  };
  headerKeys = [];
  startIndex = 0;
  isLastFilter = false;
  disputeList: Array<any> = [];
  // tslint:disable-next-line: max-line-length
  reqObj: { pageNum: number, pageSize: number, searchText?: string, fromDttm?: any, toDttm?: any, accountFilter?: Array<any>, disputeStatusFilter?: Array<any>, billprofileFilter?: Array<any> } = { pageNum: 0, pageSize: 0 };
  selectedFilter = {};
  dispData: any;
  constructor(private generalService: GeneralService, private disputeService: DisputeService, private appUtils: AppUtils,
    private spinnerService: NgxSpinnerService, private toastrService: ToastrService,
    private settingsService: SettingsService, private currencyPipe: CurrencyPipe, private decimalPipe: DecimalPipe, private translate: TranslateService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    const stateData = window.history.state;
    if (stateData && stateData.billProfId) {
      this.reqObj.billprofileFilter = [];
      this.reqObj.billprofileFilter.push(stateData.billProfId);
      if(stateData.latestDisputeRaised > 0){
        this.reqObj.fromDttm = stateData.latestDisputeRaised;
        this.reqObj.toDttm = stateData.latestDisputeRaised;
        this.fromDate = new Date(stateData.latestDisputeRaised);
        this.toDate = new Date(stateData.latestDisputeRaised);
      }

      this.onfilterCheck({
        isSelected: false,
        label: stateData.billProfileName,
        value: stateData.billProfId
      }, "Bill Profile");
    }
    this.screenActions = this.generalService.getScreenActions("Dispute");
    console.log("Screen Actions : ", this.screenActions);
    this.localeProperties = this.settingsService.properties;
    this.per_page_count = this.settingsService.PER_PAGE_COUNT;
    this.reqObj.pageSize = this.per_page_count;
    this.translate.get(Object.keys(this.headerList))
      .subscribe(translations => {
        // tslint:disable-next-line: forin
        for (const key in translations) {
          this.headerList[key].header = translations[key];
          if (this.disputeService.userAccountsData && this.disputeService.userAccountsData.length < 2) {
            if (this.headerList[key].field !== 'creditAccount') {
              this.allColumns.push(this.headerList[key]);
            } else {
              this.headerList[key].isFilterRequired = false;
            }
          } else {
            this.allColumns.push(this.headerList[key]);
          }
        }
      });
    this.prepareFilterData(true);
    this.filterKeys = Object.keys(this.filterData);
    this.dateRange = this.disputeService.getDaterange();
    setTimeout(() => {
      this.spinnerService.show('disputeListSpinner');
    });
    this.getDisputeList(this.reqObj);
    const headerProperties = this.disputeService.headerProperties;
    this.isAdmin = headerProperties['isAdmin'] ? headerProperties['isAdmin'] : false;
    this.getData();
  }

  getData() {
    this.scrollableColumn.frozenwidth = '100px';
    this.pinColumn(this.allColumns[0]);
  }

  disablePin_Expand(rowData) {
    if (!rowData['disputeHistory'] || rowData['disputeHistory'].length === 0) { return; }
    this.pinColumn(this.allColumns[0]);
    rowData.isExpand = !rowData.isExpand;
    this.disablePinning = false;
    if (rowData.isExpand) {
      this.disablePinning = true;
      setTimeout(() => {
        const expandElement: any = document.querySelectorAll('.ui-table-frozen-view  .expandRow .expandTd');
        expandElement[0].colSpan = 0;
      });
    }
  }

  pinColumn(header: any) {
    if (this.disablePinning) { return; }
    this.scrollableCols = [];
    this.frozenCols = [];
    let width = 0;
    this.allColumns.map(x => {
      if (x.columnCount > header.columnCount) {
        this.scrollableCols.push(x);
      } else {
        width += x.width;
        this.scrollableColumn.frozenwidth = width + 'px';
        this.frozenCols.push(x);
      }
    });
  }

  prepareFilterData(onload: boolean) {
    for (const hkey in this.headerList) {
      if (this.headerList[hkey] && this.headerList[hkey].isFilterRequired) {
        const key = this.headerList[hkey].header ? this.headerList[hkey].header : '';
        if (!this.filterData[key]) {
          this.filterData[key] = <any>{};
        }
        if (onload) {
          this.filterData[key].isDropDownVisible = false;
          this.filterData[key].key = hkey;
          this.filterData[key].count = 0;
          this.filterData[key].label = key;
          this.filterData[key].data = [];
        } else {
          this.filterData[key].isDropDownVisible = false;
        }
      }
    }
  }

  ngAfterViewInit() {
  }

  onFilterChange(filterlabel: string, event: Event) {
    event.stopPropagation();
    this.prepareFilterData(false);
    this.resetActiveFilter();
    const label = filterlabel;
    filterlabel = filterlabel ? filterlabel.replace(/ +/g, '') : '';
    this.searchFilterText = '';
    this.headerList[this.filterData[label].key].isActive = true;
    if (filterlabel === 'BillProfile') {
      let accArray = [];
      if (this.filterData['Account'] && this.filterData['Account'].data && this.filterData['Account'].data.length) {
        accArray = this.filterData['Account'].data.filter(acc => acc.isSelected === true).map(x => x.value);
      }
      this.disputeService.getBillProfileList({ pacc_Id: [...accArray].toString() }).subscribe(billresp => {
        this.retainFilters(label, billresp);
        this.assignFilterValues(label, billresp);
      });
    } else if (filterlabel === 'Status') {
      if (this.filterData[label] && this.filterData[label].data && this.filterData[label].data.length < 1) {
        this.disputeService.getStatusCode().subscribe(statusresp => {
          this.assignFilterValues(label, statusresp);
        });
      } else {
        this.selectedFilter = this.filterData[label];
        this.filterData[label].isDropDownVisible = true;
      }
    } else if (filterlabel === 'Account') {
      if (this.filterData[label] && this.filterData[label].data && this.filterData[label].data.length < 1) {
        this.disputeService.getAccountsList().subscribe(acctresp => {
          this.assignFilterValues(label, acctresp);
        });
      } else {
        this.retainFilters(label, this.filterData[label].data);
        this.selectedFilter = this.filterData[label];
        this.filterData[label].isDropDownVisible = true;
      }
    }
  }

  retainFilters(label: string, resp: any) {
    if (resp && Array.isArray(resp)) {
      if (this.filterValues[label] && this.filterValues[label].data && this.filterValues[label].data.length) {
        resp.forEach(item => {
          if (item.value && this.filterValues[label].data.indexOf(item.value) > -1) {
            item.isSelected = true;
          }
        });
      }
    }
  }
  resetActiveFilter() {
    // tslint:disable-next-line: forin
    for (const key in this.headerList) {
      this.headerList[key].isActive = false;
    }
  }

  assignFilterValues(label, resp) {
    if (resp && Array.isArray(resp) && this.filterData[label]) {
      this.filterData[label].data = resp;
      this.filterData[label].isDropDownVisible = true;
      this.selectedFilter = this.filterData[label];

    }
  }

  getDisputeList(reqObj: { pageNum: number, pageSize: number, searchText?: string }) {
    if (reqObj.hasOwnProperty('billprofileFilter')) {
      reqObj['billprofileFilter'] = reqObj['billprofileFilter'].toString();
    }
    if (reqObj.hasOwnProperty('accountFilter')) {
      reqObj['accountFilter'] = reqObj['accountFilter'].toString();
    }
    if (reqObj.hasOwnProperty('disputeStatusFilter')) {
      reqObj['disputeStatusFilter'] = reqObj['disputeStatusFilter'].toString();
    }
    this.disputeService.getDisputeList(reqObj).subscribe((data) => {
      this.isAuthorizedBool = true;
      this.spinnerService.hide('disputeListSpinner');
      this.spinnerService.hide('disputeTableSpinner');
      if (data && data.length) {
        this.totalCount = data[0] && data[0]['countDispute'] ? data[0]['countDispute'] : 0;
        this.disputeList = data;

        this.disputeList.map(x => {
          const dispHistory = [];
          if (x.disputeHistory && x.disputeHistory.length) {
            x.disputeHistory.forEach(item => {
              if (item.comment !== '') {
                item.disputeDate = this.datePipe.transform(item.disputeDate, this.localeProperties['dateTimeFormat'], '', this.localeProperties['locale']);
                dispHistory.push(item);
              }
            });
          }
          const obj = {
            comment: x.disputeComment,
            disputeDate: this.datePipe.transform(x.disputeCreatedDate, this.localeProperties['dateTimeFormat'], '', this.localeProperties['locale']),
            userName: x.disputeCreatedUsrName
          };
          x.disputeFromDate = this.appUtils.getDateFromMillis(x.disputeFromDate);
          x.disputeToDate = this.appUtils.getDateFromMillis(x.disputeToDate);
          x.disputeCreatedDate = this.appUtils.getDateFromMillis(x.disputeCreatedDate);
          x.disputeAmt = this.decimalPipe.transform(Number(x.disputeAmt), this.localeProperties['numberFormat'], this.localeProperties['locale']);
          x['isExpand'] = false;
          if (obj.comment !== '') {
            dispHistory.unshift(obj);
          }
          x.disputeHistory = [...dispHistory];
          return x;
        });
        console.log(this.disputeList);
      } else {
        this.disputeList = [];
        this.totalCount = 0;
      }
    }, (error) => {
      this.spinnerService.hide('disputeListSpinner');
      this.spinnerService.hide('disputeTableSpinner');
      if (error && error['status'] === 401) {
        this.isAuthorizedBool = false;
      }
    });
  }

  onSearch() {
    setTimeout(() => {
      this.spinnerService.show('disputeTableSpinner');
    });
    this.reqObj.pageNum = 0;
    this.reqObj.searchText = this.searchText;
    this.reqObj.billprofileFilter = [];
    this.reqObj.accountFilter = [];
    this.reqObj.disputeStatusFilter = [];
    this.getDisputeList(this.reqObj);
  }

  onfilterCheck(checkBoxItem: any, filterItem: string) {
    checkBoxItem.isSelected = !checkBoxItem.isSelected;
    if (!this.filterValues[filterItem]) {
      this.filterValues[filterItem] = { data: [], count: 0 };
    }
    if (checkBoxItem.isSelected) {
      if (filterItem === 'Status') {
        this.filterValues[filterItem].data.push(checkBoxItem.label);
      } else {
        this.filterValues[filterItem].data.push(checkBoxItem.value);
      }
      this.filterValues[filterItem].count++;
    } else {
      let index = 0;
      if (filterItem === 'Status') {
        index = this.filterValues[filterItem].data.indexOf(checkBoxItem.label);
      } else {
        index = this.filterValues[filterItem].data.indexOf(checkBoxItem.value);
      }
      if (index > -1) {
        this.filterValues[filterItem].data.splice(index, 1);
      }
      this.filterValues[filterItem].count--;
    }
  }

  prepareDateFilterData() {
    this.reqObj.pageNum = 0;
    this.reqObj.disputeStatusFilter = [];
    this.reqObj.accountFilter = [];
    this.reqObj.billprofileFilter = [];
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

    if (this.filterValues && Object.keys(this.filterValues).length) {
      for (const key in this.filterValues) {
        if (this.filterValues[key] && this.filterValues[key].count) {
          switch (key) {
            case 'Account': {
              this.reqObj.accountFilter = this.filterValues[key].data;
              break;
            }
            case 'Bill Profile': {
              this.reqObj.billprofileFilter = this.filterValues[key].data;
              break;
            }
            case 'Status': {
              this.reqObj.disputeStatusFilter = this.filterValues[key].data;
              break;
            }
          }
        }
      }

    }

    if (this.fromDate && this.toDate) {
      let dateValues = {};
      dateValues = this.appUtils.filterDate(this.toDate, this.fromDate);
      this.reqObj.toDttm = dateValues['modifiedToDate'] ? new Date(dateValues['modifiedToDate']).getTime() : 0;
      this.reqObj.fromDttm = dateValues['modifiedFromDate'] ? new Date(dateValues['modifiedFromDate']).getTime() : 0;
    }
    setTimeout(() => {
      this.spinnerService.show('disputeTableSpinner');
    });
  }

  onDateSearch() {
    this.prepareDateFilterData();
    this.getDisputeList(this.reqObj);
  }

  onArrowClick(type: string) {
    setTimeout(() => {
      this.spinnerService.show('disputeTableSpinner');
    });
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
    this.searchText = this.reqObj.searchText;
    this.getDisputeList(this.reqObj);
  }

  onFilterButtonSearch() {
    this.prepareDateFilterData();
    // Code to check for filters
    this.getDisputeList(this.reqObj);

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
    if (this.reqObj.billprofileFilter || (this.reqObj.billprofileFilter && this.reqObj.billprofileFilter.toString() === '')) { delete this.reqObj['billprofileFilter']; }
    if (this.reqObj.accountFilter || (this.reqObj.accountFilter && this.reqObj.accountFilter.toString() === '')) { delete this.reqObj['accountFilter']; }
    if (this.reqObj.disputeStatusFilter || (this.reqObj.disputeStatusFilter && this.reqObj.disputeStatusFilter.toString() === '')) { delete this.reqObj['disputeStatusFilter']; }
    if (this.reqObj.fromDttm) { delete this.reqObj['fromDttm']; }
    if (this.reqObj.toDttm) { delete this.reqObj['toDttm']; }
    this.filterValues = {};
    this.filterData = {};
    this.selectedFilter = {};
    this.prepareFilterData(true);
    this.isGlobalSearch = true;
    this.resetActiveFilter();
    this.getDisputeList(this.reqObj);
  }

  monthDiff(d1: Date, d2: Date) {
    let months = 0;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  editDispute(dispute: any) {
    if (dispute['statusDisplay'] !== 'Draft') { return; }
    this.dispData = dispute;
    this.isFilterVisible = false;
    setTimeout(() => {
      this.isCreateDispVisible = true;
    });
  }

  createDisp() {
    this.isCreateDispVisible = true;
    this.isFilterVisible = false;
    this.dispData = {};
  }

}


