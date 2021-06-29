import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreditNoteService, DropFilter } from '../services/creditNote.service';
import { CreditNote } from '../models/creditNote.model';
import { AppUtils } from 'src/app/utils/app.util';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { GeneralService } from '../../dashboard/services/general.service';

@Component({
  selector: 'app-credit-note-list',
  templateUrl: './creditNote.component.html',
  styleUrls: ['./creditNote.component.scss']
})
export class CreditNoteComponent implements OnInit, OnDestroy {
  fromDate: Date;
  toDate: Date;
  isAuthorizedBool = true;
  dateRange = 0;
  searchText = '';
  totalCount = 0;
  isAdmin = true;
  per_page_count = 0;
  localeProperties: any;
  allColumns = [];
  scrollableColumn: any = {};
  disablePinning = false;
  scrollableCols: any[];
  frozenCols: any[];
  isFilterVisible = false;
  filterValues = {};
  searchFilterText = '';
  filterKeys = [];
  selectedFilter = {};
  isGlobalSearch = true;
  screenActions = {};
  filterData: { [key: string]: DropFilter } = {};
  headerList = {
    'DOWNLOAD': { field: 'download', header: 'Download', subField: '', columnCount: 1, check: true, isFilterRequired: false, isActive: false, width: 150 },
    'CREDIT_NOTES.ACCOUNT': { field: 'creditAccount', header: 'Account', subField: '', columnCount: 2, check: true, isFilterRequired: true, isActive: false, width: 150 },
    'CREDIT_NOTES.BILLPROFILE': { field: 'creditBillProf', header: 'Bill Profile', subField: '', columnCount: 3, check: true, isFilterRequired: true, isActive: false, width: 150 },
    'CREDIT_NOTES.REFERENCE': { field: 'creditReferenceNumber', header: 'Reference', subField: '', columnCount: 4, check: false, isFilterRequired: false, isActive: false, width: 150 },
    'CREDIT_NOTES.TOTAL_AMOUNT': { field: 'creditTransactionAmount', header: 'Total Amount', subField: '', columnCount: 5, check: false, isFilterRequired: false, isActive: false, width: 150 },
    'CREDIT_NOTES.BALANCE_AMOUNT': { field: 'creditTransactionBalanceAmonut', header: 'Balance Amount', subField: '', columnCount: 6, check: false, isFilterRequired: false, isActive: false, width: 200 },
    'CREDIT_NOTES.CURRENCY': { field: 'creditCurrency', header: 'Currency', subField: '', columnCount: 7, check: false, isFilterRequired: false, isActive: false, width: 150 },
    'CREDIT_NOTES.STATUS': { field: 'creditStatus', header: 'Status', subField: '', columnCount: 8, check: false, isFilterRequired: false, isActive: false, width: 150 },
    'CREDIT_NOTES.DUE_DATE': { field: 'creditDueDate', header: 'Due Date', subField: '', columnCount: 9, check: false, isFilterRequired: false, isActive: false, width: 150 },
    'CREDIT_NOTES.BILL_REF_NO': { field: 'creditBillRef', header: 'Bill Reference No.', subField: '', columnCount: 10, check: false, isFilterRequired: false, isActive: false, width: 150 },
    'CREDIT_NOTES.REASON': { field: 'creditReason', header: 'Reason', subField: '', columnCount: 11, check: false, isFilterRequired: false, isActive: false, width: 150 },
    'CREDIT_NOTES.CREDIT_DATE': { field: 'creditTransactionDate', header: 'Credit date', subField: '', columnCount: 12, check: false, isFilterRequired: false, isActive: false, width: 150 }
  };

  creditList: Array<any> = [];
  reqObj: { pageNum: number, pageSize: number, searchText?: string, fromDttm?: any, toDttm?: any, accountFilter?: [], billprofileFilter?: [] } = { pageNum: 0, pageSize: 0 };
  constructor(private generalService: GeneralService, private creditNoteService: CreditNoteService, private appUtils: AppUtils,
    private spinnerService: NgxSpinnerService, private toastrService: ToastrService,
    private settingsService: SettingsService, private decimalPipe: DecimalPipe, private translate: TranslateService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.screenActions = this.generalService.getScreenActions("Credit Notes");
    if (!this.screenActions['download']) {
      delete this.headerList['DOWNLOAD'];
    }
    this.localeProperties = this.settingsService.properties;
    this.per_page_count = this.settingsService.PER_PAGE_COUNT;
    this.reqObj.pageSize = this.per_page_count;
    this.dateRange = this.creditNoteService.getDaterange();
    this.translate.get(Object.keys(this.headerList))
      .subscribe(translations => {
        // tslint:disable-next-line: forin
        for (const key in translations) {
          this.headerList[key].header = translations[key];
          if (this.creditNoteService.userAccountsData && this.creditNoteService.userAccountsData.length < 2) {
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
    setTimeout(() => {
      this.spinnerService.show('creditListSpinner');
    });
    this.prepareFilterData(true);
    this.filterKeys = Object.keys(this.filterData);
    this.getCreditList(this.reqObj);
    const headerProperties = this.creditNoteService.headerProperties;
    this.isAdmin = headerProperties['isAdmin'] ? headerProperties['isAdmin'] : false;
    this.scrollableColumn.frozenwidth = '150px';
    this.pinColumn(this.allColumns[0]);
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

  getCreditList(reqObj: { pageNum: number, pageSize: number, searchText?: string }) {
    if (reqObj.hasOwnProperty('billprofileFilter')) {
      reqObj['billprofileFilter'] = reqObj['billprofileFilter'].toString();
    }
    if (reqObj.hasOwnProperty('accountFilter')) {
      reqObj['accountFilter'] = reqObj['accountFilter'].toString();
    }
    this.creditNoteService.getCreditNotesList(reqObj).subscribe((data: CreditNote[]) => {
      this.isAuthorizedBool = true;
      this.spinnerService.hide('creditListSpinner');
      this.spinnerService.hide('creditTableSpinner');
      if (data && data.length) {
        this.totalCount = data[0] && data[0]['totalRowCount'] ? data[0]['totalRowCount'] : 0;
        this.creditList = data;
        this.creditList.map(x => {
          x.creditTransactionDate = this.datePipe.transform(x.creditTransactionDate, this.localeProperties['dateFormat'], '', this.localeProperties['locale']);
          x.creditDueDate = this.datePipe.transform(x.creditDueDate, this.localeProperties['dateFormat'], '', this.localeProperties['locale']);
          x.creditTransactionBalanceAmonut = this.decimalPipe.transform(Number(x.creditTransactionBalanceAmonut), this.localeProperties['numberFormat'], this.localeProperties['locale']);
          x.creditTransactionAmount = this.decimalPipe.transform(Number(x.creditTransactionAmount), this.localeProperties['numberFormat'], this.localeProperties['locale']);
          return x;
        });
      } else {
        this.creditList = [];
        this.totalCount = 0;
      }
    }, (error) => {
      this.creditList = [];
      this.totalCount = 0;
      this.spinnerService.hide('creditListSpinner');
      this.spinnerService.hide('creditTableSpinner');
      if (error && error['status'] === 401) {
        this.isAuthorizedBool = false;
      }
    });
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
      this.creditNoteService.getBillProfileList({ pacc_Id: [...accArray].toString() }).subscribe(resp => {
        this.retainFilters(label, resp);
        this.assignFilterValues(label, resp);
      });
    } else if (filterlabel === 'Account') {
      if (this.filterData[label] && this.filterData[label].data && this.filterData[label].data.length < 1) {
        this.creditNoteService.getAccountsList().subscribe(resp => {
          this.assignFilterValues(label, resp);
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

  onSearch() {
    setTimeout(() => {
      this.spinnerService.show('creditTableSpinner');
    });
    this.reqObj.pageNum = 0;
    this.reqObj.searchText = this.searchText;
    this.getCreditList(this.reqObj);
  }

  onSort(type: string, column: string, isLoad?: boolean) {
    if (this.creditList && this.creditList.length) {
      if (!isLoad) {
        this.headerList[column].isAsc = !this.headerList[column].isAsc;
        this.headerList[column].isDsc = !this.headerList[column].isDsc;
      }
      switch (type) {
        case 'asc': {
          if (this.headerList[column].dataType === 'string') {
            this.creditList.sort((a, b) => {
              return (a[column] < b[column]) ? -1 : ((a[column] > b[column]) ? 1 : 0);
            });
          } else if (this.headerList[column].dataType === 'number') {
            this.creditList.sort((a, b) => {
              return Number(a[column]) - Number(b[column]);
            });
          }
          break;
        }
        case 'dsc': {
          if (this.headerList[column].dataType === 'string') {
            this.creditList.sort((a, b) => {
              return (a[column] > b[column]) ? -1 : ((a[column] < b[column]) ? 1 : 0);
            });
          } else if (this.headerList[column].dataType === 'number') {
            this.creditList.sort((a, b) => {
              return Number(b[column]) - Number(a[column]);
            });
          }
          break;
        }
      }
    }
  }

  onArrowClick(type: string) {
    setTimeout(() => {
      this.spinnerService.show('creditTableSpinner');
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
    this.getCreditList(this.reqObj);
  }



  onCreditDownload(credit: CreditNote) {
    const requestObj: any = {};
    requestObj.pbpdId = credit.pbipId;
    requestObj.pcrdId = credit.pcrdId;
    requestObj.previewfile = true;

    this.creditNoteService.downloadCreditNotes(credit.pbipId, credit.pcrdId).subscribe((data: object[]) => {
      this.spinnerService.hide('creditTableSpinner');
      if (data.length > 0) {
        data.forEach((value) => {
          if (value['fileType']) {
            if (value['fileType'] === 'pdf') {
              const pdfname = value['fileName'];
              const base64dataPDF = value['fileData'];
              this.appUtils.downloadPdf(pdfname, base64dataPDF);
            } else if (value['fileType'] === 'xlsx') {
              const excelName = value['fileName'];
              const base64dataXLSX = value['fileData'];
              this.appUtils.downloadExcel(excelName, base64dataXLSX);
            }
          }
        });
      } else {
        this.toastrService.error('No Credit File found.');
      }
    });
  }
  onFilterSearch() {

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
    setTimeout(() => {
      this.spinnerService.show('creditTableSpinner');
    });

    this.reqObj.pageNum = 0;
    this.reqObj.searchText = this.searchText;
    if (this.fromDate && this.toDate) {
      let dateValues = {};
      dateValues = this.appUtils.filterDate(this.toDate, this.fromDate);
      this.reqObj.toDttm = dateValues['modifiedToDate'] ? new Date(dateValues['modifiedToDate']).getTime() : 0;
      this.reqObj.fromDttm = dateValues['modifiedFromDate'] ? new Date(dateValues['modifiedFromDate']).getTime() : 0;
    }

    this.getCreditList(this.reqObj);

  }

  onReset() {
    this.fromDate = null;
    this.toDate = null;
    this.searchText = '';
    setTimeout(() => {
      this.spinnerService.show('creditTableSpinner');
    });
    this.reqObj.pageNum = 0;
    this.reqObj.searchText = this.searchText;
    if (this.reqObj.billprofileFilter || (this.reqObj.billprofileFilter && this.reqObj.billprofileFilter.toString() === '')) { delete this.reqObj['billprofileFilter']; }
    if (this.reqObj.accountFilter || (this.reqObj.accountFilter && this.reqObj.accountFilter.toString() === '')) { delete this.reqObj['accountFilter']; }
    if (this.reqObj.fromDttm) { delete this.reqObj['fromDttm']; }
    if (this.reqObj.toDttm) { delete this.reqObj['toDttm']; }
    this.filterValues = {};
    this.filterData = {};
    this.selectedFilter = {};
    this.prepareFilterData(true);
    this.isGlobalSearch = true;
    this.resetActiveFilter();
    this.getCreditList(this.reqObj);
  }

  monthDiff(d1: Date, d2: Date) {
    let months = 0;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  onFilterButtonSearch() {
    this.prepareDateFilterData();
    this.getCreditList(this.reqObj);
  }
  onDateSearch() {
    this.prepareDateFilterData();
    this.getCreditList(this.reqObj);
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

  ngOnDestroy() {

  }

}
