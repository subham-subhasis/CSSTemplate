import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/app/utils/app.util';
import { ErrorMessages } from 'src/app/utils/constants';
import { DisputeInterface } from 'src/app/modules/dashboard/interfaces/dispute.interface';
import { DisputeModel } from 'src/app/modules/dashboard/models/dispute.model';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-dispute-amount',
  templateUrl: './dispute-amount.component.html',
  styleUrls: ['./dispute-amount.component.scss']
})
export class DisputeAmountComponent implements OnInit, OnDestroy {

  disputeData: DisputeInterface;
  disputeAmtCur = '';
  noData = false;
  errMsg = '';
  subscription: Subscription;
  currencies = [];
  localeProperties: any;
  dateRange = 0;
  constructor(private spinnerService: NgxSpinnerService, private generalService: GeneralService,
    private toastr: ToastrService, private appUtil: AppUtils, private settingsService: SettingsService) { }

  ngOnInit() {
    this.localeProperties = this.settingsService.properties;
    this.currencies = this.generalService.currencies;
    setTimeout(() => {
      this.spinnerService.show('disputeSpinner');
    });
    this.subscription = this.generalService.billId.subscribe((billId) => {
      this.dateRange = this.appUtil.getDateRangeValue(this.generalService.systemProperties, 'DisputeAmountComponent');
      if (billId !== 0) {
        this.generateDisputeData(billId);
      } else {
        this.spinnerService.hide('disputeSpinner');
        this.dateRange = this.appUtil.getDateRangeValue(this.generalService.systemProperties, 'DisputeAmountComponent');
        this.noData = true;
        this.errMsg = ErrorMessages.DISPUTE_ERR_MSG + ' for the past ' + this.dateRange + ' months';
      }
    });
  }

  private generateDisputeData(billId: number) {
    this.generalService.getDisputeData(billId).subscribe((disputeDataResponse: any) => {
      this.spinnerService.hide('disputeSpinner');
      const respMsg: any = disputeDataResponse['responseMessage'];
      const condition = !respMsg && respMsg !== '';
      if (disputeDataResponse.bipId) {
        this.noData = false;
        const disputeData: DisputeModel = Object.assign({}, disputeDataResponse);
        const disputeFromDate = new Date(disputeData['disputeFromDate']);
        const disputeToDate = new Date(disputeData['disputeToDate']);
        this.disputeAmtCur = this.appUtil.getCurrencyImage(disputeData['bipHomeCurAmount']['curCd'], this.currencies);
        disputeData['currencyBreakDown'].forEach((value) => {
          const currImage = this.appUtil.getCurrencyImage(value['curCd'], this.currencies);
          value['currImage'] = currImage;
        });
        this.disputeData = {
          disputeFromDate: disputeFromDate,
          disputeToDate: disputeToDate,
          bipHomeCurAmount: disputeData['bipHomeCurAmount'],
          currencyBreakDown: disputeData['currencyBreakDown']
        };
      } else {
        // modifiedDates = this.appUtil.modifyDatesForNoData(this.dateRange);
        this.noData = true;
        this.errMsg = ErrorMessages.DISPUTE_ERR_MSG + ' for the past ' + this.dateRange + ' months';
      }
    },
      (err) => {
        this.spinnerService.hide('disputeSpinner');
        this.noData = true;
        this.toastr.error(ErrorMessages.TOASTR_DISPUTE_MSG);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
