import {
  Component,
  OnInit,
  Renderer2,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { BillProfileService } from 'src/app/modules/billscreen/services/bill-profile.service';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/app/utils/app.util';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings.service';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';

@Component({
  selector: 'app-bill-viewer',
  templateUrl: './bill-viewer.component.html',
  styleUrls: ['./bill-viewer.component.scss']
})
export class BillViewerComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  src = '';
  billNameForPdf = '';
  billNameForExcel = '';
  subscription1: Subscription;
  subscription2: Subscription;
  isPDF = false;
  isExcel = false;
  billEmpty = false;
  errMsg = '';
  base64dataPDF = '';
  base64dataXlsx = '';
  activeView = '';
  excelJspUrl = '';
  pdfOrExcelData: any = {};
  screenActions = {};
  constructor(private renderer: Renderer2, private billProfileService: BillProfileService,
    private cd: ChangeDetectorRef, private toastrService: ToastrService,
    private appUtil: AppUtils, private spinnerService: NgxSpinnerService, private generalService: GeneralService,private settingService: SettingsService, private translate: TranslateService) { }
  ngOnInit() {
    this.screenActions = this.generalService.getScreenActions("Bills");
    this.subscription1 = this.billProfileService.downloadBillType.subscribe((value) => {
      if (value === 'pdf') {
        this.downloadPdf();
      } else if (value === 'excel') {
        this.downloadExcel();
      }
    });
    this.billProfileService.loadBills.subscribe((value) => {
      if (value === 'loadOnFilters') {
        this.subscribeChange(value);
      }
    });
  }

  ngAfterViewInit() {
    this.subscription2 = this.billProfileService.onChange.subscribe((data) => {
      this.subscribeChange(data);
    });
  }

  ngAfterViewChecked() {
    if (this.billEmpty) {
      this.billEmpty = true;
      this.cd.detectChanges();
    }
  }

  private subscribeChange(data: any) {
    this.isExcel = false;
    this.isPDF = false;
    this.base64dataPDF = '';
    this.base64dataXlsx = '';
    this.removeView();
    if (data === 'loadBillView' || data === 'loadOnFilters') {
      this.showDiv();
      this.billEmpty = false;
      this.openPDFViewer();
    } else if (data === 'loadEmptyBillView') {
      this.billEmpty = true;
      this.translate.get('NO_PREVIEW_MESSAGE').subscribe((val: string) => {
        this.errMsg = val;
      });
    }
  }

  private showDiv() {
    const domEl1 = document.querySelector('.icon-section');
    if (domEl1) {
      this.renderer.setStyle(domEl1, 'visibility', 'visible');
    }
  }

  private billViewer() {
    this.toastrService.clear();
    const billProfileId: number = this.billProfileService.entityId;
    const billId: number = this.billProfileService.pbilId;
    this.billProfileService.downloadBill(billProfileId, billId).subscribe((data: object[]) => {
      this.spinnerService.hide('billViewerSpinner');
      if (data && data.length > 0) {
        this.billProfileService.downloadDropDownData = data;
        this.billProfileService.onChange.next('loadViewDownloadDropdown');
        data.forEach((value) => {
          if (value['fileType']) {
            if (value['fileType'] === 'pdf') {
              this.isPDF = true;
              this.billNameForPdf = value['fileName'];
              this.base64dataPDF = value['fileData'];
              // this.appUtil.embedPDF(value);
              this.pdfOrExcelData.PDF = value;
            } else if (value['fileType'] === 'xlsx' || value['fileType'] === 'xls') {
              this.pdfOrExcelData.Excel = value;
              this.billNameForExcel = value['fileName'];
              this.base64dataXlsx = value['fileData'] ? value['fileData'] : '';
              this.isExcel = true;
            }
          }
        });
        if ((this.base64dataPDF && this.base64dataXlsx) || (this.base64dataPDF && !this.base64dataXlsx)) {
          this.appUtil.embedPDF(this.pdfOrExcelData.PDF);
          this.activeView = 'pdf';
        } else {
          this.activeView = 'xlsx';
          const href: string = window.location.href;
          const protocol = this.settingService.applicationProperties['protocol'];
          const path = this.appUtil.generateDynamicUrl(href);
          const host = window.location.host;
          if (!environment.production) {

            this.excelJspUrl = this.pdfOrExcelData.Excel['url'] ? 'http://10.113.116.113:8080/pp-sprint4/' + this.pdfOrExcelData.Excel['url'] : '';
          } else {

            // this.excelJspUrl = this.pdfOrExcelData.Excel['url'] ? 'http://' + host + '/' + path + '/' + this.pdfOrExcelData.Excel['url'] : '';
            this.excelJspUrl = this.pdfOrExcelData.Excel['url'] ? `${protocol}://${host}/${path}/${this.pdfOrExcelData.Excel['url']}` : '';
          }
          this.appUtil.prepareFrame(this.excelJspUrl);
        }
      } else {
        this.billNameForExcel = '';
        this.billNameForPdf = '';
        this.billEmpty = true;
        this.translate.get('NO_PREVIEW_MESSAGE').subscribe((val: string) => {
          this.errMsg = val;
        });
        this.toastrService.error('No bills to show');
      }
    });
  }

  openPDFViewer() {
    if (!this.base64dataPDF) {
      this.activeView = 'pdf';
      this.removeView();
      this.billViewer();
    } else {
      this.activeView = 'pdf';
      this.removeView();
      if (this.pdfOrExcelData.PDF) {
        this.appUtil.embedPDF(this.pdfOrExcelData.PDF);
      }
    }
  }

  private removeView() {
    const domEl = document.querySelector('.bill_box');
    if (domEl && domEl.firstChild) {
      this.renderer.removeChild(domEl, domEl.firstChild);
    }
  }

  download() {
    if (this.activeView === 'pdf') {
      this.downloadPdf();
    } else if (this.activeView === 'xlsx') {
      this.downloadExcel();
    }
  }

  private downloadPdf() {
    this.appUtil.downloadPdf(this.billNameForPdf, this.base64dataPDF);
    this.billProfileService.downloadBillType.next('');
  }

  private downloadExcel() {
    this.appUtil.downloadExcel(this.billNameForExcel, this.base64dataXlsx);
    this.billProfileService.downloadBillType.next('');
  }

  openXlsxViewer() {
    if (!this.base64dataXlsx) {
      this.activeView = 'xlsx';
      this.removeView();
      this.billViewer();
    } else {
      this.activeView = 'xlsx';
      this.removeView();
      if (this.pdfOrExcelData.Excel) {
        const value = this.pdfOrExcelData.Excel;
        const href: string = window.location.href;
        const protocol = this.settingService.applicationProperties['protocol'];
        const path = this.appUtil.generateDynamicUrl(href);
        const host = window.location.host;
        if (!environment.production) {
          this.excelJspUrl = value['url'] ? 'http://10.113.116.113:8080/pp-sprint4/' + value['url'] : '';
        } else {
          this.excelJspUrl = value['url'] ? `${protocol}://${host}/${path}/${value['url']}` : '';
        }
        this.appUtil.prepareFrame(this.excelJspUrl);
      }
    }
  }

  ngOnDestroy() {
    this.subscription2.unsubscribe();
    this.subscription1.unsubscribe();
  }

}
