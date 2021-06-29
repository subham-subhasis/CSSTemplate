import { Component, OnInit, Renderer2, Output, EventEmitter, Input } from '@angular/core';
import { DisputeService } from '../../services/dispute.service';
import { AppUtils } from 'src/app/utils/app.util';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DecimalPipe, DatePipe } from '@angular/common';
import { SettingsService } from 'src/app/services/settings.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { format } from 'util';

@Component({
  selector: 'app-dispute-create',
  templateUrl: './dispute-create.component.html',
  styleUrls: ['./dispute-create.component.scss']
})
export class DisputeCreateComponent implements OnInit {
  dispSubscription: Subscription;
  reviewByDate: any = '';
  isReviewByDateValid = true;
  accountsData: any = [];
  acctSearchText = '';
  acctId = 0;
  dispId = 0;
  isAccountDropVisible = false;
  billProfData: any = [];
  billProfId = 0;
  billProfSearchText = '';
  isBillProfDropVisible = false;
  billData: any = [];
  billId = 0;
  billPeriodId = 0;
  billSearchText = '';
  isBillDropVisible = false;
  fromDttm = '';
  toDttm = '';
  disputeAmount = '';
  comment = '';
  currency = '';
  isCreate = true;
  isMultiAccount = true;
  showSpinner = false;
  minDate: Date;
  @Input() disputeData = {} as any;
  @Output() cancelForm = new EventEmitter();
  @Output() disputeEdited = new EventEmitter();
  localeProperties: any = {};

  // tslint:disable-next-line: max-line-length
  constructor(private spinnerService: NgxSpinnerService, private settingsService: SettingsService, private disputeService: DisputeService, private renderer: Renderer2, private appUtils: AppUtils, private toastrSrvice: ToastrService, private decimalPipe: DecimalPipe, private datePipe: DatePipe) { }

  ngOnInit() {
    const tempDate = new Date();
    const month = tempDate.getMonth();
    const day = tempDate.getDate();
    const year = tempDate.getFullYear();
    this.minDate = new Date(year, month, day);
    this.localeProperties = this.settingsService.properties;

    if (this.disputeData && Object.keys(this.disputeData).length) {
      this.isCreate = false;
      this.mapDisputeValues();
      this.reviewByDateValidation();
    } else {
      this.resetAllValues();
      this.getAccounts();
      this.isCreate = true;
    }
  }

  reviewByDateValidation() {
    this.isReviewByDateValid = true;
    if (this.reviewByDate < this.minDate) {
      this.isReviewByDateValid = false;
    }
  }
  onReviewByDateChange(event) {
    this.isReviewByDateValid = true;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges() {
    if (this.disputeData && Object.keys(this.disputeData).length) {
      this.isCreate = false;
      this.mapDisputeValues();
      this.reviewByDateValidation();
    } else {
      this.resetAllValues();
      this.getAccounts();
      this.isCreate = true;
    }
  }

  resetAllValues() {
    this.acctSearchText = '';
    this.acctId = 0;
    this.dispId = 0;
    this.isAccountDropVisible = false;
    this.billProfData = [];
    this.billProfId = 0;
    this.billProfSearchText = '';
    this.isBillProfDropVisible = false;
    this.billData = [];
    this.billId = 0;
    this.billPeriodId = 0;
    this.billSearchText = '';
    this.isBillDropVisible = false;
    this.fromDttm = '';
    this.toDttm = '';
    this.disputeAmount = '';
    this.comment = '';
    this.currency = '';
    this.reviewByDate = '';
    this.isReviewByDateValid = true;
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event) => {
      this.isAccountDropVisible = false;
    });
  }

  mapDisputeValues() {
    this.dispId = this.disputeData['pdisId'];
    this.acctId = this.disputeData['paccId'];
    this.billProfId = this.disputeData['pbipId'] ? this.disputeData['pbipId'] : 0;
    this.billId = this.disputeData['pbilId'];
    this.billPeriodId = this.disputeData['pbpdId'];
    this.disputeAmount = this.disputeData['disputeAmt'];
    this.comment = this.disputeData['disputeComment'];
    this.acctSearchText = this.disputeData['accountName'];
    this.billProfSearchText = this.disputeData['billProfileName'];
    this.billSearchText = this.disputeData['billName'];
    this.fromDttm = this.disputeData['disputeFromDate'] ? this.datePipe.transform(this.disputeData['disputeFromDate'], this.localeProperties['dateFormat'], '', this.localeProperties['locale']) : '';
    this.toDttm = this.disputeData['disputeToDate'] ? this.datePipe.transform(this.disputeData['disputeToDate'], this.localeProperties['dateFormat'], '', this.localeProperties['locale']) : '';
    this.currency = this.disputeData['currency'] && this.disputeData['currency'].currencyCode ? this.disputeData['currency'].currencyCode : 'INR';
    this.reviewByDate = this.disputeData['disputeReviewByDate'] ? this.datePipe.transform(this.disputeData['disputeReviewByDate'], this.localeProperties['dateFormat'], '', this.localeProperties['locale']) : '';
    this.reviewByDate = this.disputeData['disputeReviewByDate'] ? new Date(this.disputeData['disputeReviewByDate']) : '';
  }

  getAccounts() {
    this.showSpinner = true;
    this.disputeService.getAccountsList().subscribe(resp => {
      this.showSpinner = false;
      this.accountsData = resp;
      if (this.accountsData && this.accountsData.length === 1) {
        this.acctSearchText = this.accountsData[0].label;
        this.acctId = this.accountsData[0].value;
        this.isMultiAccount = false;
        this.getBillProfiles(this.acctId);
      }
    }, (error) => {
      this.showSpinner = false;
    });
  }

  getBillProfiles(acctId) {
    this.showSpinner = true;
    this.disputeService.getBillProfileList({ pacc_Id: acctId.toString() }).subscribe(resp => {
      this.showSpinner = false;
      this.billProfData = resp;
    }, (error) => {
      this.showSpinner = false;
    });
  }

  getBills(billProfId) {
    this.showSpinner = true;
    this.disputeService.getBillsFromBillProf(billProfId).subscribe(resp => {
      this.showSpinner = false;
      this.billData = resp;
    }, (error) => {
      this.showSpinner = false;
    });
  }

  onAccountSelection(account: any) {
    this.acctSearchText = account.label;
    this.billProfSearchText = '';
    this.billSearchText = '';
    this.billId = 0;
    this.billProfId = 0;
    this.billPeriodId = 0;
    this.fromDttm = '';
    this.toDttm = '';
    this.acctId = account.value;
    this.isAccountDropVisible = false;
    this.disputeAmount = '';
    this.comment = '';
    this.currency = '';
    this.reviewByDate = '';
    this.getBillProfiles(account.value);
  }

  onBillProfSelection(billProf: any) {
    this.billProfSearchText = billProf.label;
    this.billSearchText = '';
    this.billId = 0;
    this.billPeriodId = 0;
    this.fromDttm = '';
    this.toDttm = '';
    this.billProfId = billProf.value;
    this.isBillProfDropVisible = false;
    this.comment = '';
    this.currency = '';
    this.reviewByDate = '';
    this.disputeAmount = '';
    this.getBills(billProf.value);
  }

  onBillSelection(bill: any) {
    this.billId = bill.pbilId;
    this.billPeriodId = bill.pbpdId;
    this.billSearchText = bill.billName;
    this.fromDttm = '';
    this.toDttm = '';
    this.comment = '';
    this.currency = '';
    this.reviewByDate = '';
    this.disputeAmount = '';
    this.fromDttm = bill.billPeriod ? this.appUtils.getDateFromMillis(bill.billPeriod.fromDate) : '';
    this.toDttm = bill.billPeriod ? this.appUtils.getDateFromMillis(bill.billPeriod.toDate) : '';
    this.currency = bill.currency && bill.currency.currencyCode ? bill.currency.currencyCode : 'INR';
    this.isBillDropVisible = false;
  }


  onFocus(type: string) {
    switch (type) {
      case 'ACCOUNT': {
        this.isAccountDropVisible = true;
        this.isBillProfDropVisible = false;
        this.isBillDropVisible = false;
        break;
      }
      case 'BILLPROF': {
        this.isBillProfDropVisible = true;
        this.isBillDropVisible = false;
        this.isAccountDropVisible = false;
        break;
      }
      case 'BILL': {
        this.isBillDropVisible = true;
        this.isBillProfDropVisible = false;
        this.isAccountDropVisible = false;
        break;
      }

    }
  }

  onDisputeSave() {
    if (!this.billProfId || !this.billId || !this.disputeAmount || !this.billPeriodId || !this.reviewByDate || this.reviewByDate === '' || !this.isReviewByDateValid) {
      this.toastrSrvice.error('Insufficient details to Raise/Update a Dispute');
      return;
    }
    this.showSpinner = true;
    const reviewByDate = this.datePipe.transform(this.reviewByDate, 'MM/dd/yyyy', '', this.localeProperties['locale']);
    const reviewByDateMillisec = reviewByDate ? new Date(reviewByDate).getTime() : 0;
    this.unFormatCurrencyValue();
    this.disputeService.createDispute(this.dispId, this.billProfId, this.billId, Number(this.disputeAmount), this.billPeriodId, this.comment, reviewByDateMillisec).subscribe(resp => {
      this.showSpinner = false;
      if (resp['responseMessage'] && resp['responseMessage'] === 'OK') {
        if (this.dispId) {
          this.toastrSrvice.success('Dispute updated successfully');
        } else {
          this.toastrSrvice.success('Dispute created successfully');
        }
        this.cancelForm.emit();
        this.disputeEdited.emit();
      } else {
        this.toastrSrvice.error('Some error occured');
      }
    },
      err => {
        this.showSpinner = false;
        this.toastrSrvice.error('Some error occured');
      }
    );
  }
  validateNumericInput(e: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    const keyCode = e.which ? e.which : e.keyCode;
    const ret = keyCode === 46 || (keyCode >= 48 && keyCode <= 57);
    return ret;

  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    if (this.dispSubscription) {
      this.dispSubscription.unsubscribe();
    }
  }
  formatCurrencyValue() {
    if (this.disputeAmount) {
      this.disputeAmount = this.decimalPipe.transform(Number(this.disputeAmount), this.localeProperties['numberFormat'], this.localeProperties['locale']);
    }
  }

  unFormatCurrencyValue() {
    this.disputeAmount = this.disputeAmount.replace(/[^\d.-]/g, '');
  }

}
