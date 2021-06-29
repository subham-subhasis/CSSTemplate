import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { SettingsService } from 'src/app/services/settings.service';
import { AppUtils } from 'src/app/utils/app.util';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component implements OnInit {
  searchText: string = '';
  tableData = [] as any;
  allDocuments = [] as any;
  selectedBillProf = 'All';
  customerType: { isVendor: boolean, isCustomer: boolean } = { isVendor: false, isCustomer: false }
  selectedBillProfData = {} as any;
  latestBillRun: Date;
  isExternal: boolean = false;
  latestDisputeRaised: Date;
  selectedBillProfileSummarizedData = {} as any;
  displayedColumns: string[] = ['accounts', 'billProfiles', 'docsCategory', 'uploadedDate', 'fileName'];
  billProfList = [] as any;
  localeProperties = {} as any;
  constructor(private settingService: SettingsService, private generalService: GeneralService, private router: Router, private apputils: AppUtils, private dashboardService: DashboardService, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.localeProperties = this.settingService.properties;
    this.latestBillRun = null;
    this.latestDisputeRaised = null;
    setTimeout(() => {
      this.spinnerService.show('dashBoardV2Spinner');
      this.spinnerService.show('dashBoardRightPanelSpinner');
      this.loadInitialData();
      this.isExternal = this.generalService.isExternal();
      if (this.isExternal && this.generalService.userAccountsData && this.generalService.userAccountsData.length > 0) {
        const paccCustomerType = this.generalService.userAccountsData[0].paccCustomerType;
        const dashBoardConstants = this.generalService.jsonConstants['dashboard'];
        if (paccCustomerType === dashBoardConstants['Vendor']) {
          this.customerType.isVendor = true;
        } else if (paccCustomerType === dashBoardConstants['Customer']) {
          this.customerType.isCustomer = true;
        } else if (paccCustomerType === dashBoardConstants['CustomerVendor']) {
          this.customerType.isCustomer = true;
        }
      }
    }, 1000);

  }

  routeScreen(routePath: string) {
    let obj = {};
    if (this.selectedBillProf != 'All' && routePath !== 'ManageDocuments') {
      obj = {
        billProfId: this.selectedBillProfData.pbipId,
        billProfName: this.selectedBillProfData.billProfileName,
        latestBillRun: this.selectedBillProfileSummarizedData.latestBillRun,
        latestBillAmount: this.selectedBillProfileSummarizedData.latestBillAmount,
        latestDisputeRaised: this.selectedBillProfileSummarizedData.latestDisputeRaised
      };

      if (routePath.includes('Bills/BillViewer')) {
        this.generalService.setSelectedBillProfile(this.selectedBillProfData.billProfileName);
        this.generalService.billId.next(this.selectedBillProfData.pbipId);
        this.router.navigate([routePath], { state: obj });
      } else {
        this.router.navigate([routePath], { state: obj });
      }
    } else {
      this.router.navigate([routePath]);
    }
  }

  loadInitialData() {
    return this.dashboardService.getAllBillProfiles().pipe(
      map(resp => {
        this.billProfList = resp;
      }),
      switchMap(resp => {
        const userData = this.generalService.userInfoData;
        let billProfIds = [];
        if (userData['usrName'] !== 'Root') {
          billProfIds = this.billProfList.map(a => a.pbipId);
        }
        return forkJoin([this.dashboardService.getUploadedFilesData(), this.dashboardService.getBillProfileDetail(billProfIds)])
      })
    ).subscribe(resp => {
      this.tableData = resp[0];
      if (this.tableData.length > 5) {
        this.tableData = this.tableData.slice(0, 5);
      }
      this.selectedBillProfileSummarizedData = resp[1];
      this.allDocuments = JSON.parse(JSON.stringify(resp[0]));
      if (this.selectedBillProfileSummarizedData && this.selectedBillProfileSummarizedData.latestBillRun > 0) {
        this.latestBillRun = new Date(this.selectedBillProfileSummarizedData.latestBillRun);
      }
      if (this.selectedBillProfileSummarizedData && this.selectedBillProfileSummarizedData.latestDisputeRaised > 0) {
        this.latestDisputeRaised = new Date(this.selectedBillProfileSummarizedData.latestDisputeRaised);
      }
      setTimeout(() => {
        this.spinnerService.hide('appSpinner');
        this.spinnerService.hide('dashBoardV2Spinner');
        this.spinnerService.hide('dashBoardRightPanelSpinner');
      });
    }, err => {
      setTimeout(() => {
        this.spinnerService.hide('appSpinner');
        this.spinnerService.hide('dashBoardV2Spinner');
        this.spinnerService.hide('dashBoardRightPanelSpinner');
      });
    })
  }

  onBillProfChange(billProf?) {
    setTimeout(() => {
      this.spinnerService.show('dashBoardRightPanelSpinner');
    });
    this.selectedBillProfData = billProf;
    this.selectedBillProf = billProf.billProfileName;
    this.selectedBillProfileSummarizedData.latestBillAmount = 0;
    this.selectedBillProfileSummarizedData.latestBillRun = null;
    this.selectedBillProfileSummarizedData.latestDisputeRaised = null;
    this.selectedBillProfileSummarizedData.currency = '';
    this.latestBillRun = null;
    this.latestDisputeRaised = null;
    forkJoin([this.dashboardService.getBillProfileDetail([billProf.pbipId]), this.dashboardService.getUploadedFilesData(billProf.pbipId)])
      .subscribe(resp => {
        this.selectedBillProfileSummarizedData = resp[0];
        if (this.selectedBillProfileSummarizedData && this.selectedBillProfileSummarizedData.latestBillRun > 0) {
          this.latestBillRun = new Date(this.selectedBillProfileSummarizedData.latestBillRun);
        }
        if (this.selectedBillProfileSummarizedData && this.selectedBillProfileSummarizedData.latestDisputeRaised > 0) {
          this.latestDisputeRaised = new Date(this.selectedBillProfileSummarizedData.latestDisputeRaised);
        }
        this.tableData = resp[1];
        if (this.tableData.length > 5) {
          this.tableData = this.tableData.slice(0, 5);
        }
        this.spinnerService.hide('dashBoardRightPanelSpinner');
      }, err => {
        this.spinnerService.hide('dashBoardRightPanelSpinner');
      }
      )
  }

  changeDateFormat(dateInMS: any): Date {
    let date = new Date();
    if (dateInMS) {
      date = new Date(parseInt(dateInMS));
    }
    return date;
  }

  downloadFile(file: any) {
    const base64CompleteString = file.fileBase64Type + ',' + file.fileBase64String;
    const BASE64_MARKER = ';base64,';
    const base64Index = base64CompleteString.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = base64CompleteString.substring(base64Index);
    const byteString = window.atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: file.fileType });
    this.apputils.exportTempDocument(new File([blob], file.fileName, { type: file.fileType }), file.fileName);
  }

  onClickAll() {
    this.selectedBillProf = 'All';
    this.tableData = this.allDocuments;
    const userData = this.generalService.userInfoData;
    let billProfIds = [];
    if (userData['userName'] !== 'Root') {
      billProfIds = this.billProfList.map(a => a.pbipId);
    }
    setTimeout(() => {
      this.spinnerService.show('dashBoardRightPanelSpinner');
    });
    this.dashboardService.getBillProfileDetail(billProfIds).subscribe(resp => {
      this.selectedBillProfileSummarizedData = resp;
      this.spinnerService.hide('dashBoardRightPanelSpinner');
    }, err => {
      this.spinnerService.hide('dashBoardRightPanelSpinner');
    })
  }

}
