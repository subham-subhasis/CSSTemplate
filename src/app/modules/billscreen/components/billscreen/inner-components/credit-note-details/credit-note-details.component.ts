import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { BillProfileService } from 'src/app/modules/billscreen/services/bill-profile.service';
import { CreditNote } from 'src/app/modules/dashboard/models/credit-note.model';
import { AppUtils } from 'src/app/utils/app.util';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ErrorMessages } from 'src/app/utils/constants';
import { SettingsService } from 'src/app/services/settings.service';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';

@Component({
  selector: 'app-credit-note-details',
  templateUrl: './credit-note-details.component.html',
  styleUrls: ['./credit-note-details.component.scss']
})
export class CreditNoteDetailsComponent implements OnInit, OnDestroy {
  src = '';
  options = [];
  fetchingParam = true;
  creditNoteExcelName = '';
  creditNotePDFName = '';
  subscription: Subscription;
  isPDF = false;
  isExcel = false;
  billEmpty = false;
  errMsg = '';
  base64PdfData = '';
  base64ExcelData = '';
  creditId = 0;
  excelJspUrl = '';
  screenActions = {};

  pdfOrExcelData: { PDF: { value: any, isPDF: boolean }, Excel: { value: any, isExcel: boolean } } = { PDF: { value: {}, isPDF: false }, Excel: { value: {}, isExcel: false } };
  constructor(private billProfileService: BillProfileService, private appUtils: AppUtils,
    private toastrService: ToastrService, private router: Router, private spinnerService: NgxSpinnerService,
    private renderer: Renderer2, private translate: TranslateService, private settingService: SettingsService, private generalService: GeneralService) { }

  ngOnInit() {
    this.screenActions = this.generalService.getScreenActions("Bills");
    this.removeView();
    let entityId: number = this.billProfileService.entityId;
    let pbilId: number = this.billProfileService.pbilId;
    this.subscription = this.billProfileService.onChange.subscribe((data) => {
      if (data === 'reloadCreditNotes') {
        this.removeView();
        this.spinnerService.show('billViewerSpinner');
        this.fetchingParam = true;
        this.options = [];
        entityId = this.billProfileService.entityId;
        pbilId = this.billProfileService.pbilId;
        this.loadCreditNotes(entityId, pbilId);
      }
    });
  }



  creditDownload(event: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    if (this.pdfOrExcelData.Excel.isExcel) {
      this.appUtils.downloadExcel(this.creditNoteExcelName, this.base64ExcelData);
    } else if (this.pdfOrExcelData.PDF.isPDF) {
      this.appUtils.downloadPdf(this.creditNotePDFName, this.base64PdfData);
    }
    this.billProfileService.downloadBillType.next('');
  }

  private showEmptyMessage() {
    this.billEmpty = true;
    this.translate.get('NO_PREVIEW_MESSAGE').subscribe((val: string) => {
      this.errMsg = val;
    });
  }



  private loadCreditNotes(entityId: number, pbilId: number) {
    this.billProfileService.getCreditNotesList(entityId, pbilId).subscribe((data: CreditNote[]) => {
      this.fetchingParam = false;
      if (data && data.length > 0) {
        this.billEmpty = false;
        this.options = data;
        if (data[0]['id']) {
          this.creditId = +data[0]['id'];
          this.creditViewer(this.creditId);
        }
      } else {
        this.showEmptyMessage();
        this.toastrService.error('Empty Credit notes list');
        this.spinnerService.hide('billViewerSpinner');
      }
    });
  }

  private creditViewer(creditId: number) {
    const billProfileId: number = this.billProfileService.entityId;
    this.billProfileService.downloadCreditNotes(billProfileId, creditId).subscribe((data) => {
      this.spinnerService.hide('billViewerSpinner');
      if (data.length > 0 && data[0]['fileData']) {
        data.forEach((value: object) => {
          if (value['fileType']) {
            if (value['fileType'] === 'pdf') {
              this.pdfOrExcelData.PDF.value = value;
              this.isPDF = true;
              this.creditNotePDFName = value['fileName'];
              this.base64PdfData = value['fileData'];
            } else if (value['fileType'] === 'xlsx') {
              this.pdfOrExcelData.Excel.value = value;
              this.creditNoteExcelName = value['fileName'];
              this.base64ExcelData = value['fileData'];
              this.isExcel = true;
            }
          }
        });
        if ((this.base64PdfData && this.base64ExcelData) || (this.base64PdfData && !this.base64ExcelData)) {
          this.appUtils.embedPDF(this.pdfOrExcelData.PDF.value);
          this.pdfOrExcelData.PDF.isPDF = true;
        } else {
          this.pdfOrExcelData.Excel.isExcel = true;
          const href: string = window.location.href;
          const protocol = this.settingService.applicationProperties['protocol'];
          const path = this.appUtils.generateDynamicUrl(href);
          const host = window.location.host;
          if (!environment.production) {

            this.excelJspUrl = this.pdfOrExcelData.Excel.value['url'] ? 'http://10.113.116.113:8080/pp-sprint4/' + this.pdfOrExcelData.Excel.value['url'] : '';
          } else {

            this.excelJspUrl = this.pdfOrExcelData.Excel.value['url'] ? `${protocol}://${host}/${path}/${this.pdfOrExcelData.Excel.value['url']}` : '';
          }
          this.appUtils.prepareFrame(this.excelJspUrl);
        }
      } else {
        this.showEmptyMessage();
        this.toastrService.error('No credit notes to show');
      }
    }, err => {
      this.spinnerService.hide('billViewerSpinner');
      this.toastrService.error('Unable to display credit notes');
    });
  }

  loadBillView() {
    this.router.navigate(['../Bills/BillViewer']);
    this.spinnerService.show('billViewerSpinner');
    this.billProfileService.onChange.next('loadBillView');
  }

  reloadView(optionId: string) {
    this.creditId = optionId !== null || optionId !== '' ? +optionId : 0;
    this.removeView();
    this.isPDF = false;
    this.isExcel = false;
    this.creditViewer(this.creditId);
  }

  private removeView() {
    const domEl = document.querySelector('.bill_box');
    if (domEl && domEl.firstChild) {
      this.renderer.removeChild(domEl, domEl.firstChild);
    }
  }

  openPDFViewer() {
    if (!this.base64PdfData) {
      this.removeView();
      this.creditViewer(this.creditId);
    } else {
      this.pdfOrExcelData.Excel.isExcel = false;
      this.pdfOrExcelData.PDF.isPDF = true;
      this.removeView();
      if (this.pdfOrExcelData.PDF.value) {
        this.appUtils.embedPDF(this.pdfOrExcelData.PDF.value);
      }

    }
  }

  openExcelViewer() {
    if (!this.base64ExcelData) {
      this.removeView();
      this.creditViewer(this.creditId);
    } else {
      this.pdfOrExcelData.Excel.isExcel = true;
      this.pdfOrExcelData.PDF.isPDF = false;
      this.removeView();
      if (this.pdfOrExcelData.Excel.value) {
        const value = this.pdfOrExcelData.Excel.value;
        const href: string = window.location.href;
        const path = this.appUtils.generateDynamicUrl(href);
        const protocol = this.settingService.applicationProperties['protocol'];
        const host = window.location.host;
        if (!environment.production) {
          this.excelJspUrl = value['url'] ? 'http://10.113.116.113:8080/pp-sprint4/' + value['url'] : '';
        } else {
          // this.excelJspUrl = value['url'] ? 'http://' + host + '/' + path + '/' + value['url'] : '';
          this.excelJspUrl = value['url'] ? `${protocol}://${host}/${path}/${value['url']}` : '';
        }
        this.appUtils.prepareFrame(this.excelJspUrl);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
