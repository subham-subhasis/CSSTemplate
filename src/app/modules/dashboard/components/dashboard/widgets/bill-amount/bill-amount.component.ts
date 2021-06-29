import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/app/utils/app.util';
import { ErrorMessages } from 'src/app/utils/constants';
import { BillAmountInterface } from 'src/app/modules/dashboard/interfaces/billamount.interface';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { BillTotal } from 'src/app/modules/dashboard/models/billTotal.model';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-bill-amount',
  templateUrl: './bill-amount.component.html',
  styleUrls: ['./bill-amount.component.scss']
})
export class BillAmountComponent implements OnInit, OnDestroy {
  billData: BillAmountInterface;
  dueDays: number;
  noData = false;
  subscription: Subscription;
  errMsg = '';
  currencies = [];
  dateRange = 0;
  negativeDueDays = false;
  localeProperties: any;
  constructor(
    private spinnerService: NgxSpinnerService,
    private generalService: GeneralService,
    private toastr: ToastrService,
    private appUtils: AppUtils,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.localeProperties = this.settingsService.properties;
    this.currencies = this.generalService.currencies;
    setTimeout(() => {
      this.spinnerService.show('cardSpinner');
    });
    this.subscription = this.generalService.billId.subscribe(billId => {
      if (billId !== 0) {
        this.generateBillData(billId);
      } else {
        this.spinnerService.hide('cardSpinner');
        this.dateRange = this.appUtils.getDateRangeValue(this.generalService.systemProperties, 'BillViewComponent');
        // modifiedDates = this.appUtils.modifyDatesForNoData(this.dateRange);
        this.noData = true;
        this.errMsg = ErrorMessages.BILL_VIEW_ERR_MSG + ' for the past ' + this.dateRange + ' months';
      }
    });
  }

  private generateBillData(billId: number) {
    this.generalService.getBillData(billId).subscribe(
      billData => {
        this.spinnerService.hide('cardSpinner');
        const respMsg: any = billData['responseMessage'];
        const condition = !respMsg && respMsg !== '';
        if (respMsg && respMsg.toLowerCase() === 'accepted') {
          this.noData = false;
          const totalBillDetails: BillTotal = Object.assign({}, billData);
          const dueDate = new Date(totalBillDetails['dueDate']);
          const billPeriodFrom = new Date(totalBillDetails['billPeriodFrom']);
          const billPeriodTo = new Date(totalBillDetails['billPeriodTo']);
          const currencyImg = this.appUtils.getCurrencyImage(
            totalBillDetails['currency'] && totalBillDetails['currency']['currencyCode'] ?
              totalBillDetails['currency']['currencyCode'] : '', this.currencies
          );
          this.billData = {
            billPeriodFrom: billPeriodFrom,
            billPeriodTo: billPeriodTo,
            dueDate: dueDate,
            amount: JSON.stringify(totalBillDetails['amount']),
            currency: currencyImg
          };
          this.dueDays = this.appUtils.getDifferenceFromCurrentDate(
            totalBillDetails['dueDate']
          );
          if (this.dueDays < 0) {
            this.negativeDueDays = true;
            this.dueDays = Math.abs(this.dueDays);
          }
        } else {
          this.dateRange = this.appUtils.getDateRangeValue(this.generalService.systemProperties, 'BillViewComponent');
          // modifiedDates = this.appUtils.modifyDatesForNoData(this.dateRange);
          this.noData = true;
          this.errMsg = ErrorMessages.BILL_VIEW_ERR_MSG + ' for the past ' + this.dateRange + ' months';
        }
      },
      err => {
        this.spinnerService.hide('cardSpinner');
        this.noData = true;
        this.toastr.error(ErrorMessages.TOASTR_BILL_AMT_ERR_MSG);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
