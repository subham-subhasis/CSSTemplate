import {
  Component, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef, AfterViewInit,
  ViewChildren
} from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { BillProfileService } from 'src/app/modules/billscreen/services/bill-profile.service';
import { BillChartModel } from 'src/app/modules/dashboard/models/billchart.model';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/app/utils/app.util';
import { SettingsService } from 'src/app/services/settings.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-billdetails',
  templateUrl: './billdetails.component.html',
  styleUrls: ['./billdetails.component.scss']
})
export class BilldetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  billList: object[] = [];
  isAuthorized = true;
  showMenu = false;
  dateTime1: Date;
  dateTime2: Date;
  togglePanel: any = {};
  selected: any = [];
  billSearchCopy = [];
  expanded = true;
  currencies = [];
  isPdf = false;
  isExcel = false;
  filterSubject = false;
  localeProperties: any;
  ellipsisDropDown: { [key: string]: string } = {
    'Dispute': 'dispute',
    'Credit Note': 'credit', 'Latest Version': 'latestVersion', 'All': 'all'
  };
  buttonValue = '';
  private subscription2: Subscription;
  private subscription1: Subscription;
  emptyBillView = false;
  compLoadInitStarted = false;
  billSearchData: BillChartModel[] = [];
  fileData = {};
  dateRange = 0;
  billProfileName = '';
  screenActions = {};
  @ViewChildren('billListElement') billListElement: any;
  @ViewChild('ellipsis', { static: false }) ellipsis: ElementRef;
  constructor(private sharedService: SharedService, private spinnerService: NgxSpinnerService,
    private router: Router, private billProfileService: BillProfileService,
    private generalService: GeneralService, private toastrService: ToastrService,
    private renderer: Renderer2, private apputils: AppUtils, private settingsService: SettingsService,
    private dateTimeAdapter: DateTimeAdapter<any>) { }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event) => {
      if (this.ellipsis && this.ellipsis.nativeElement) {
        this.togglePanel = [];
      }
      this.showMenu = false;
    });
  }

  ngOnInit() {
    this.screenActions = this.generalService.getScreenActions("Bills");
    this.localeProperties = this.settingsService.properties;
    this.dateTimeAdapter.setLocale(this.localeProperties['locale']);
    this.billProfileService.onChange.next('');
    this.billProfileService.billProfile_Index = {};
    this.dateRange = this.apputils.getDateRangeValue(this.generalService.systemProperties, 'BillSearch');
    this.subscription1 = this.billProfileService.onChange.subscribe((value) => {
      this.populateDownloadOptions(value);
    });
    this.buttonValue = Object.keys(this.ellipsisDropDown)[2];
    document.getElementById('leftSidenav').style.zIndex = '1000000';
    document.getElementById('leftSidenav').style.border = '1px solid';
    this.currencies = this.generalService.currencies;
    this.subscribePanelEvents();
    this.isAuthorized = this.sharedService.isAuthorized;
    if (this.isAuthorized) {
      setTimeout(() => {
        this.spinnerService.show('billDetailsSpinner');
      });
    }
    this.billList = this.sharedService.billList;
    this.compLoadInitStarted = true;
    const stateData = window.history.state;
    if (stateData && stateData.billProfId) {
      // if(stateData.latestBillRun > 0){
      //   this.dateTime1 = new Date(stateData.latestBillRun);
      //   this.dateTime2 = new Date(stateData.latestBillRun);
      // }
      this.onBillIdChange(false);
      this.compLoadInitStarted = false;
    } else {
      this.onBillIdChange(this.compLoadInitStarted);
    }
  }

  private populateDownloadOptions(value: any) {
    if (value === 'loadViewDownloadDropdown') {
      const dataVal: object[] = this.billProfileService.downloadDropDownData;
      if (dataVal && dataVal.length > 0) {
        for (let indx = 0; indx < this.billSearchData.length; indx++) {
          if (this.billSearchData[indx]['fileDataXlsx']) {
            delete this.billSearchData[indx]['fileDataXlsx'];
          }
          if (this.billSearchData[indx]['fileDataPdf']) {
            delete this.billSearchData[indx]['fileDataPdf'];
          }
        }
        dataVal.forEach((fileInfo) => {
          if (fileInfo['fileType']) {
            if (fileInfo['fileType'] === 'pdf') {
              this.isPdf = true;
              this.activeDropDownView(fileInfo);
            } else if (fileInfo['fileType'] === 'xlsx' || fileInfo['fileType'] === 'xls') {
              this.isExcel = true;
              this.activeDropDownView(fileInfo);
            }
          }
        });
      }
    }
  }

  private activeDropDownView(dataVal: object) {
    this.selected.forEach((element: boolean, index: number) => {
      if (element && dataVal['fileType'] === 'xlsx' || dataVal['fileType'] === 'xls') {
        this.billSearchData[index]['fileDataXlsx'] = dataVal;
      } else if (element && dataVal['fileType'] === 'pdf') {
        this.billSearchData[index]['fileDataPdf'] = dataVal;
      }
    });
  }

  updateButtonValue(item: object) {
    this.buttonValue = item['key'];
    const entityId: number = this.billProfileService.entityId;
    const itemValue = item['value'];
    this.spinnerService.show('spinner');
    this.filterSubject = true;
    if (this.dateTime1 && this.dateTime2) {
      this.filterData();
    } else {
      this.getBillProfiles(entityId, false, itemValue, '', '');
    }
  }

  private onBillIdChange(compLoadInitStarted: boolean) {
    this.subscription2 = this.generalService.billId.subscribe((data) => {
      this.billProfileService.onChange.next('');
      this.buttonValue = Object.keys(this.ellipsisDropDown)[2];
      this.router.navigate(['../Bills/BillViewer']);
      const filterVal = this.ellipsisDropDown[Object.keys(this.ellipsisDropDown)[2]];
      this.filterSubject = false;
      if (!this.isAuthorized) {
        this.spinnerService.hide('billDetailsSpinner');
        return;
      }
      if (compLoadInitStarted) {
        this.billProfileName = this.sharedService.billList[0]['billProfileName'];
        this.billProfileService.entityId = this.billList[0]['pbipId'];
        this.getBillProfiles(this.billList[0]['pbipId'], true, filterVal, '', '');
        compLoadInitStarted = false;
        this.spinnerService.show('billDetailsSpinner');
      } else {
        this.billProfileName = this.generalService.selectedBillProfile;
        this.removeView();
        this.resetDates();
        this.spinnerService.show('spinner');
        this.billProfileService.entityId = data;
        this.getBillProfiles(data, false, filterVal, '', '');
        this.spinnerService.show('billDetailsSpinner');
      }
    });
  }

  private subscribePanelEvents() {
    this.billProfileService.onChangeBillsDisplayEvent.subscribe((value) => {
      if (value === 'open') {
        this.expanded = false;
      } else if (value === 'close') {
        this.expanded = true;
      }
    });
  }

  private getBillProfiles(id: number, initStarted: boolean, filter: string, fromDt: string, toDt: string) {
    const fromDtt = fromDt ? new Date(fromDt).getTime() : 0;
    const toDtt = toDt ? new Date(toDt).getTime() : 0;
    this.billProfileService.getBillSearchData(id, filter, fromDtt, toDtt).subscribe((data: BillChartModel[]) => {
      if (data.length > 0) {
        this.emptyBillView = false;
        this.billSearchData = data;
        this.billSearchCopy = [...data];
        this.selected = this.billSearchCopy.map((p) => false);
        this.billSearchData.forEach((value) => {
          const currCode = value['currency']['currencyCode'];
          this.currencies.forEach((currency) => {
            if (currency['code'] === currCode) {
              value['currImg'] = currency['symbol'];
            }
          });
        });
        this.spinnerService.hide('billDetailsSpinner');
        this.callBillView(data, initStarted);
      } else {
        this.loadEmptyView();
      }
    },
      err => {
        this.toastrService.error('Unable to fetch bills');
        this.loadEmptyView();
      });
  }

  private loadEmptyView() {
    this.billSearchData = [];
    this.emptyBillView = true;
    this.spinnerService.hide('spinner');
    this.spinnerService.hide('billDetailsSpinner');
    this.billProfileService.onChange.next('loadEmptyBillView');
  }

  private callBillView(data: BillChartModel[], initStarted: boolean) {
    const indexTrueCondition: boolean = this.billProfileService.billProfile_Index['index'] ||
      this.billProfileService.billProfile_Index['index'] === 0;
    if (indexTrueCondition &&
      this.billProfileService.billProfile_Index['billItem']) {
      const index = this.billProfileService.billProfile_Index['index'];
      const billItem = this.billProfileService.billProfile_Index['billItem'];
      this.billProfileService.pbilId = billItem['pbilId'];
      this.selected[index] = true;
      if (this.billProfileService.onChange.value === 'createDispute') {
        this.openDisputeDetails(billItem, index);
      } else {
        this.loadNewBillView(data[0]['pbilId'], 0);
      }
      this.billProfileService.billProfile_Index = {};
    } else {
      this.selected[0] = true;
      this.billProfileService.pbilId = data[0]['pbilId'];
      this.billProfileService.onChange.next('loadBillView');
      this.spinnerService.show('billViewerSpinner');
    }
    if (this.filterSubject) {
      this.router.navigate(['../../Bills/BillViewer/']);
      this.billProfileService.loadBills.next('loadOnFilters');
    }
    if (initStarted) {
      this.spinnerService.hide('billDetailsSpinner');
    } else {
      this.spinnerService.hide('spinner');
    }
    document.getElementById('leftSidenav').style.zIndex = '1000';
    document.getElementById('leftSidenav').style.border = 'none';
  }

  openDisputeDetails(billItem: BillChartModel, idx: number) {
    this.togglePanel = [];
    this.applyActive(idx);
    this.spinnerService.show('billViewerSpinner');
    this.billProfileService.pbilId = billItem['pbilId'];
    this.billProfileService.disputeData = billItem;
    this.billProfileService.onChange.next('reloadTable');
    this.router.navigate(['../../Bills/BillViewer/CreateDispute']);
  }

  openCreditNoteDisplay(billItem: BillChartModel, idx: number) {
    this.togglePanel = [];
    this.applyActive(idx);
    this.billProfileService.pbilId = billItem['pbilId'];
    this.billProfileService.onChange.next('reloadCreditNotes');
    this.router.navigate(['../../Bills/BillViewer/CreditNoteDetails']);
  }

  toggleBilloption(id: number, idx: number) {
    this.billSearchData.forEach((x, index) => {
      if (index !== idx) {
        this.togglePanel[index] = false;
      } else {
        this.togglePanel[index] = true;
      }
    });
  }

  loadNewBillView(id: number, idx: number) {
    this.billSearchData.forEach((x, index) => {
      if (index !== idx) {
        this.togglePanel[index] = false;
      }
    });
    this.toastrService.clear();
    if (this.billProfileService.pbilId === id) {
      return;
    }
    this.spinnerService.show('billViewerSpinner');
    this.applyActive(idx);
    this.router.navigate(['../Bills/BillViewer']);
    this.billProfileService.pbilId = id;
    this.billProfileService.onChange.next('loadBillView');
  }

  applyActive(idx: number) {
    this.selected = this.billSearchCopy.map((p) => false);
    this.selected[idx] = !this.selected[idx];
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.togglePanel = [];
    if (this.showMenu) {
      this.showMenu = false;
    } else {
      this.showMenu = true;
    }
  }

  openDispute(idx: number, billItem: BillChartModel) {
    this.togglePanel = [];
    this.billProfileService.billProfile_Index['index'] = idx;
    this.billProfileService.billProfile_Index['billItem'] = billItem;
    this.billProfileService.disputeData = billItem;
    this.applyActive(idx);
    this.router.navigate(['../../Bills/BillViewer/CreateDispute/Create']);
    this.billProfileService.onChange.next('createDispute');
  }

  filterData() {
    const diff = this.dateRange;
    const fromDate = new Date(this.dateTime1);
    const toDate = new Date(this.dateTime2);
    if (!this.dateTime1 || !this.dateTime2) {
      this.toastrService.error('Invalid date field(s)');
      return;
    }
    if (toDate.getTime() < fromDate.getTime()) {
      this.toastrService.error('To date should be greater than from date');
      return;
    }
    if (this.monthDiff(fromDate, toDate) > diff) {
      this.toastrService.error('Allowed range is ' + diff + ' months');
      return;
    }
    let filterVal = '';
    let dateValues = {};
    if (!this.buttonValue) {
      filterVal = this.ellipsisDropDown[Object.keys(this.ellipsisDropDown)[2]];
    } else {
      filterVal = this.buttonValue;
    }
    const entityId: number = this.billProfileService.entityId;
    dateValues = this.apputils.filterDate(this.dateTime1, this.dateTime2);
    this.spinnerService.show('spinner');
    this.filterSubject = false;
    this.getBillProfiles(entityId, false, filterVal, dateValues['modifiedToDate'],
      dateValues['modifiedFromDate']);
  }

  resetDates() {
    this.dateTime1 = null;
    this.dateTime2 = null;
  }

  private removeView() {
    const domEl = document.querySelector('.bill_box');
    const domEl1 = document.querySelector('.icon-section');
    if (domEl && domEl.firstChild && domEl1 && domEl1.firstChild) {
      this.renderer.removeChild(domEl, domEl.firstChild);
      this.renderer.setStyle(domEl1, 'visibility', 'hidden');
    }
  }

  download(parameter: string) {
    this.billProfileService.downloadBillType.next(parameter);
  }

  monthDiff(d1: Date, d2: Date) {
    let months = 0;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  moveDOWN(event: Event, idx: number) {
    if (idx === this.billSearchData.length - 1 && idx !== 0) {
      return;
    } else {
      let nextpbilId = 0;
      this.billListElement.toArray()[idx + 1].nativeElement.focus();
      nextpbilId = this.billSearchData[idx + 1]['pbilId'];
      this.loadNewBillView(nextpbilId, idx + 1);
    }

  }

  moveUP(event: Event, idx: number) {
    if (idx === 0) {
      return;
    } else {
      let nextpbilId = 0;
      this.billListElement.toArray()[idx - 1].nativeElement.focus();
      nextpbilId = this.billSearchData[idx - 1]['pbilId'];
      this.loadNewBillView(nextpbilId, idx - 1);
    }
  }

  ngOnDestroy() {
    this.subscription2.unsubscribe();
    this.subscription1.unsubscribe();
  }

}
