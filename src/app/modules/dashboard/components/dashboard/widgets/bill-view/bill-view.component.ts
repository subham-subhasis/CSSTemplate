import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { GoogleChartComponent } from 'angular-google-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/app/utils/app.util';
import { ErrorMessages } from 'src/app/utils/constants';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { BillChartModel } from 'src/app/modules/dashboard/models/billchart.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.scss']
})
export class BillViewComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private spinner: NgxSpinnerService,
    private generalService: GeneralService,
    private toastr: ToastrService,
    private appUtil: AppUtils,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private decimalPipe: DecimalPipe
  ) { }
  data = [];
  options: object;
  customFormatter: object[];
  type = 'ColumnChart';
  chartObj: any;
  errMsg = '';
  noData = false;
  billViewData: BillChartModel[] = [];
  columnNames = ['Month', 'Amount', { type: 'string', role: 'tooltip' }];
  subscription: Subscription;
  billAmtCurr = '';
  selectedBillProfile = '';
  @ViewChild('chart', { static: false }) chart: GoogleChartComponent;
  @ViewChild('barchart', { static: false }) barchartRef: ElementRef;

  onResize(event: any) {
    this.renderChart(this.barchartRef.nativeElement.offsetWidth);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.spinner.show('billViewSpinner');
    });
    this.subscription = this.generalService.billId.subscribe(billId => {
      if (billId !== 0) {
        this.generateBillChartData(billId);
      } else {
        this.errorMsgs();
      }
    });
    this.generalService.toggleWidth.subscribe(value => {
      if (value === 'increaseWidth') {
        this.renderChart(this.barchartRef.nativeElement.offsetWidth - 110);
      } else if (value === 'decreaseWidth') {
        this.renderChart(this.barchartRef.nativeElement.offsetWidth + 80);
      }
    });
  }

  ngOnInit() { }

  private renderChart(dynamicWidth: number) {
    if (this.data && this.data.length > 0 && this.billViewData.length > 0) {
      const fromdate = this.appUtil.getMonthAndYearFromMillis(
        this.billViewData[0]['billPeriod']['fromDate']
      );
      const toDate = this.appUtil.getMonthAndYearFromMillis(
        this.billViewData[this.billViewData.length - 1]['billPeriod'][
        'fromDate'
        ]
      );
      const maxMin: object = this.appUtil.getMaxAndMin(this.data);
      const len = JSON.stringify(Math.round(maxMin['max'])).length;
      let roundLength = 1;
      let maxVal = 0;
      let format = '';
      let titleDesc = '';
      titleDesc = this.translateValues(titleDesc, fromdate, toDate);
      len >= 4 ? (format = 'short') : (format = '#,###');
      if (maxMin['max'] >= 10) {
        roundLength = Math.pow(10, len - 1);
      }
      maxMin['max'] <= 4
        ? (maxVal = 4)
        : (maxVal = Math.ceil(maxMin['max'] / roundLength) * roundLength);
      this.options = {
        title: titleDesc,
        titleTextStyle: {
          color:'#4d4f5c',
          fontSize:'12'
        },
        legend: { position: 'none' },
        vAxis: {
          format: format,
          viewWindow: { min: 0, max: maxVal }
        },
        hAxis: {
          textStyle: {
            fontSize: 9
          }
        },
        chartArea: { width: '85%', height: '70%', left: '12%' },
        height: 290,
        width: dynamicWidth,
        colors: ['#D42B5F'],
        bar: { groupWidth: '30%' }
      };
    }
  }

  private translateValues(titleDesc: string, fromDt: string, toDt: string) {
    this.translate.get('BILLVIEW.CHARTTITLE').subscribe((val: string) => {
      titleDesc += val + fromDt;
    });
    this.translate.get('BILLVIEW.TO').subscribe((val: string) => {
      titleDesc += val + toDt;
    });
    return titleDesc;
  }

  onReady() {
    const wrapper = this.chart.wrapper;
    this.chartObj = wrapper.getChart();
    const axisLabels: HTMLCollection[] = this.barchartRef.nativeElement.getElementsByTagName(
      'text'
    );
    const currencyVal = this.getCurrencyImage();
    this.appUtil.appendCurrencySign(axisLabels, currencyVal);
  }

  private getCurrencyImage() {
    const currencies = this.generalService.currencies;
    const currencyVal = this.appUtil.getCurrencyImage(this.billAmtCurr, currencies);
    return currencyVal;
  }

  downloadImage() {
    const bprfName = this.generalService.getSelectedBillProfile();
    const svgString = new XMLSerializer().serializeToString(
      this.chart.getChartElement().getElementsByTagName('svg')[0]
    );
    const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const img = new Image();
    const height = this.chart.getChartElement().offsetHeight;
    const width = this.chart.getChartElement().offsetWidth;
    const url = URL.createObjectURL(svg);
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const png = canvas.toDataURL('image/png');
      const downloadImage = document.createElement('a');
      downloadImage.setAttribute('id', 'img');
      downloadImage.href = png;
      downloadImage.download = bprfName + '.png';
      document.body.appendChild(downloadImage);
      downloadImage.click();
      document.body.removeChild(downloadImage);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  private generateBillChartData(billId: number) {
    this.generalService.getBillViewData(billId).subscribe(
      billData => {
        this.data = [];
        this.billViewData = billData;
        if (this.billViewData.length > 0) {
          if (this.noData) {
            this.noData = false;
          }
          let currencyFound = false;
          this.billViewData.forEach(element => {
            if (element['currency'] && !currencyFound) {
              currencyFound = true;
              this.billAmtCurr = element['currency']['currencyCode'];
            }
            const dataArr = [];
            const month = this.appUtil.getMonthFromMillis(
              element['billPeriod']['fromDate']
            );
            const locale = this.settingsService.properties['locale'];
            const numberFormat = this.settingsService.properties['numberFormat'];
            const data = element['billTransactionAmount'];
            const transformeddata = data === 0 ? 0 : this.decimalPipe.transform(data, numberFormat, locale);
            const currencyVal = this.getCurrencyImage();
            dataArr.push(month);
            dataArr.push(data);
            dataArr.push(currencyVal + transformeddata);
            this.data.push(dataArr);
          });
          this.renderChart(this.barchartRef.nativeElement.offsetWidth);
          this.spinner.hide('billViewSpinner');
        } else {
          this.errorMsgs();
        }
      },
      err => {
        this.errorMsgs();
        this.toastr.error(ErrorMessages.TOASTR_BILL_VIEWDETAILS_ERR_MSG);
      }
    );
  }

  private errorMsgs() {
    const modifiedDates = this.getModifiedDates();
    this.noData = true;
    this.spinner.hide('billViewSpinner');
    this.errMsg = ErrorMessages.TOASTR_BILL_VIEWDETAILS_ERR_MSG + ' from ' + modifiedDates['frmDate']
      + ' to ' + modifiedDates['toDate'];
  }

  private getModifiedDates() {
    let modifiedDates = {};
    let dateRange = 0;
    dateRange = this.appUtil.getDateRangeValue(this.generalService.systemProperties, 'BillViewComponent');
    modifiedDates = this.appUtil.modifyDatesForNoData(dateRange);
    return modifiedDates;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
