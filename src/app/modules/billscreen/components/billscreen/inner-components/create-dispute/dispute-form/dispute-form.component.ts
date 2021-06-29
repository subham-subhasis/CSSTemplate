import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BillProfileService } from 'src/app/modules/billscreen/services/bill-profile.service';
import { BillChartModel } from 'src/app/modules/dashboard/models/billchart.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, DecimalPipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-dispute-form',
  templateUrl: './dispute-form.component.html',
  styleUrls: ['./dispute-form.component.scss']
})
export class DisputeFormComponent implements OnInit, OnDestroy {
  showForm = false;
  isReviewByDateValid = true;
  cdForm: FormGroup;
  errMsg = '';
  disputeData: BillChartModel;
  currency = '';
  reviewByDate: any = '';
  pdisId = 0;
  isReadOnly = false;
  subscription: Subscription;
  minDate: Date;
  localeProperties = {}
  @Input() billDetails: BillChartModel;
  @Input() disputes = [];
  heightClass = '';
  constructor(
    private router: Router,
    private billProfileService: BillProfileService,
    private toastrSrvice: ToastrService,
    private datePipe: DatePipe,
    private spinnerService: NgxSpinnerService,
    private generalService: GeneralService,
    private settingsService: SettingsService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit() {
    this.localeProperties = this.settingsService.properties;
    const tempDate = new Date();
    const month = tempDate.getMonth();
    const day = tempDate.getDate();
    const year = tempDate.getFullYear();
    this.minDate = new Date(year, month, day);
    this.showForm = false;
    this.initializeForm();
    this.loadDispute();
    this.patchValue(false);
    this.subscription = this.billProfileService.onChange.subscribe(value => {
      if (value === 'createDispute') {
        this.showForm = true;
        this.loadDispute();
        this.errMsg = 'Mandatory fields required!';
        this.initializeForm();
        this.patchValue(false);
      } else if (value === 'hideForm') {
        this.showForm = false;
        this.cdForm.reset();
      } else if (value === 'patchFormValues') {
        this.showForm = true;
        this.cdForm.reset();
        const {
          fromDate,
          toDate,
          amt,
          billName,
          disComment
        }: {
          fromDate: string;
          toDate: string;
          amt: any;
          billName: string;
          disComment: string;
        } = this.generateFormDataFromRow();
        this.ptchValuesFromRowData(fromDate, toDate, amt, billName, disComment);
      }
    });
    const routeParam = this.router.url.substring(1, this.router.url.length);
    if (routeParam === 'Bills/CreateDispute/Create') {
      this.showForm = true;
    }

  }

  private generateFormDataFromRow() {
    const rowdata = this.billProfileService.disputeTableData;
    this.pdisId = rowdata['id'];
    this.reviewByDate = rowdata['disputeReviewByDate'] ? new Date(rowdata['disputeReviewByDate']) : '';
    this.reviewByDateValidation();
    const locale = this.settingsService.properties['locale'];
    const dateFormat = this.settingsService.properties['dateFormat'];
    const numberFormat = this.settingsService.properties['numberFormat'];
    const status: string = rowdata['statusDisplay'];
    if (status.toLowerCase() !== 'draft') {
      this.isReadOnly = true;
    } else {
      this.isReadOnly = false;
    }
    this.currency = rowdata['currency']['currencyCode'];
    const fromDate =
      rowdata && rowdata['disputeFromDate']
        ? this.datePipe.transform(rowdata['disputeFromDate'], dateFormat, '', locale)
        : '';
    const toDate =
      rowdata && rowdata['disputeToDate']
        ? this.datePipe.transform(rowdata['disputeToDate'], dateFormat, '', locale)
        : '';
    const amt: any =
      rowdata && rowdata['disputeAmt'] ? this.decimalPipe.transform(rowdata['disputeAmt'], numberFormat, locale) : '';
    // const billRefNo = rowdata && rowdata['bilRefNo'] ? rowdata['bilRefNo'] : '';
    const billName = rowdata && rowdata['billName'] ? rowdata['billName'] : '';
    const disComment = rowdata['disputeComment'] ? rowdata['disputeComment'] : '';

    // window.scrollTo(0, document.body.scrollHeight);
    return { fromDate, toDate, amt, billName, disComment };
  }

  private loadDispute() {
    this.disputeData = this.billProfileService.disputeData;
    if (this.disputeData) {
      this.currency = this.disputeData['currency']['currencyCode'];
    }
  }

  private patchValue(isEdit: boolean) {
    const locale = this.settingsService.properties['locale'];
    const dateFormat = this.settingsService.properties['dateFormat'];
    const fromDate =
      this.disputeData && this.disputeData['billPeriod']['fromDate']
        ? this.datePipe.transform(
          this.disputeData['billPeriod']['fromDate']
          , dateFormat, '', locale
        )
        : '';
    const toDate =
      this.disputeData && this.disputeData['billPeriod']['toDate']
        ? this.datePipe.transform(
          this.disputeData['billPeriod']['toDate']
          , dateFormat, '', locale
        )
        : '';
    this.ptchValuesFromData(toDate, fromDate, isEdit);
  }

  private ptchValuesFromData(toDate: string, fromDate: string, isEdit: boolean) {
    const locale = this.settingsService.properties['locale'];
    const numberFormat = this.settingsService.properties['numberFormat'];
    this.cdForm.patchValue({
      disputeFormPart2: {
        disputedAmt:
          isEdit && this.disputeData && this.disputeData['billDisputeAmount']
            ? this.decimalPipe.transform(this.disputeData['billDisputeAmount'], numberFormat, locale)
            : '',
        to: toDate
      },
      disputeFormPart1: {
        from: fromDate,
        bill:
          this.disputeData && this.disputeData['billReferenceNumber']
            ? this.disputeData['billReferenceNumber']
            : ''
      }
    });
  }

  private ptchValuesFromRowData(
    toDate: string,
    fromDate: string,
    amt: any,
    bilRefNo: string,
    disComment: string
  ) {
    this.cdForm.patchValue({
      disputeFormPart2: {
        disputedAmt: amt,
        to: toDate
      },
      disputeFormPart1: {
        from: fromDate,
        bill: bilRefNo
      },
      disputeFormPart3: {
        comment: disComment
      }
    });
  }

  initializeForm() {
    this.cdForm = new FormGroup({
      disputeFormPart1: new FormGroup({
        from: new FormControl(null, []),
        bill: new FormControl(null, [])
      }),
      disputeFormPart2: new FormGroup({
        to: new FormControl(null, []),
        disputedAmt: new FormControl(null,
          [Validators.required, this.forbiddenDisputeValues.bind(this)])
      }),
      disputeFormPart3: new FormGroup({
        comment: new FormControl(null, [])
      })
    });
  }

  saveData() {
    const billProfileId = this.billProfileService.entityId;
    const pbilId = this.disputeData['pbilId'];
    const pbpdId = this.disputeData['billPeriod']['pbpdId'];
    let amt = this.cdForm.get('disputeFormPart2').get('disputedAmt').value;
    amt = amt.replace(/[^\d.-]/g, '');
    const comment = this.cdForm.get('disputeFormPart3').get('comment').value;
    if (!this.reviewByDate || this.reviewByDate === '' || !this.isReviewByDateValid) {
      this.toastrSrvice.error('Insufficient details to Raise/Update a Dispute');
      return;
    }
    const reviewByDate = this.datePipe.transform(this.reviewByDate, 'MM/dd/yyyy', '', this.settingsService.properties['locale']);
    const reviewByDateMillisec = reviewByDate ? new Date(reviewByDate).getTime() : 0;
    if (this.pdisId === 0) {
      this.spinnerService.show('billViewerSpinner');
      this.billProfileService
        .createDispute(billProfileId, pbilId, +amt, pbpdId, comment, reviewByDateMillisec)
        .subscribe(
          data => {
            if (data['responseMessage'] && data['responseMessage'] === 'OK') {
              this.toastrSrvice.success('Dispute created successfully');
              this.loadBillView();
            } else {
              this.toastrSrvice.error('Some error occured');
            }
          },
          err => this.toastrSrvice.error('Some error occured')
        );
    } else {
      this.spinnerService.show('billViewerSpinner');
      this.billProfileService
        .updateDispute(billProfileId, pbilId, amt, pbpdId, this.pdisId, comment, reviewByDateMillisec)
        .subscribe(
          data => {
            this.spinnerService.hide('billViewerSpinner');
            const responseMsg: string = data['responseMessage'];
            if (responseMsg && responseMsg === 'OK') {
              this.toastrSrvice.success('Dispute updated successfully');
              this.loadBillView();
            } else {
              this.toastrSrvice.error('Some error occured');
            }
          },
          err => {
            this.spinnerService.hide('billViewerSpinner');
            this.toastrSrvice.error('Some error occured');
          }
        );
    }
  }

  reviewByDateValidation() {
    this.isReviewByDateValid = true;
    if (this.reviewByDate < this.minDate) {
      this.isReviewByDateValid = false;
    }
  }

  private loadBillView() {
    const id: number = this.generalService.billId.getValue();
    // this.billProfileService.onChange.next('reloadTable');
    this.generalService.billId.next(id);
    this.spinnerService.hide('billViewerSpinner');
  }

  forbiddenDisputeValues(control: FormControl): { [s: string]: boolean } {
    const controlVal = control.value;
    if (controlVal < 0) {
      return { 'numberInvalid': true };
    }
    return null;
  }
  validateNumericInput(e: KeyboardEvent) {
    const keyCode = e.which ? e.which : e.keyCode;
    const ret = keyCode === 46 || (keyCode >= 48 && keyCode <= 57);
    return ret;
  }
  formatCurrencyValue() {
    let amt = this.cdForm.get('disputeFormPart2').get('disputedAmt').value;
    if (amt) {
      amt = this.decimalPipe.transform(Number(amt), this.localeProperties['numberFormat'], this.localeProperties['locale']);
      this.cdForm.patchValue({
        disputeFormPart2: {
          disputedAmt: amt
        }
      });
    }
    console.log('FormatCurrencyValue');
  }

  unFormatCurrencyValue() {
    let amt = this.cdForm.get('disputeFormPart2').get('disputedAmt').value;
    amt = amt.replace(/[^\d.-]/g, '');
    this.cdForm.patchValue({
      disputeFormPart2: {
        disputedAmt: amt
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
