import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { GoogleChartComponent } from 'angular-google-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/app/utils/app.util';
import { ErrorMessages } from 'src/app/utils/constants';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { CreditNote } from 'src/app/modules/dashboard/models/credit-note.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-credit-notes',
  templateUrl: './credit-notes.component.html',
  styleUrls: ['./credit-notes.component.scss']
})
export class CreditNotesComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private spinner: NgxSpinnerService,
    private generalService: GeneralService,
    private toastr: ToastrService,
    private appUtil: AppUtils,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private decimalPipe: DecimalPipe
  ) { }
  data: object[] = [];
  options: object;
  customFormatter: object[];
  chartObj: any;
  type = 'ColumnChart';
  errMsg = '';
  noData = false;
  creditNotes: CreditNote[] = [];
  columnNames = ['Month', 'Amount', { type: 'string', role: 'tooltip' }];
  subscription: Subscription;
  creditNoteCurrency = '';

  @ViewChild('chart', { static: false }) chart: GoogleChartComponent;
  @ViewChild('barchart', { static: false }) barchartRef: ElementRef;
  onResize(event: any) {
    this.renderChart(this.barchartRef.nativeElement.offsetWidth);
  }
  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.spinner.show('creditNoteSpinner');
    });
    this.subscription = this.generalService.billId.subscribe(billId => {
      if (billId !== 0) {
        this.generateCreditNotes(billId);
      } else {
        this.errorMsgs();
      }
    });
    this.generalService.toggleWidth.subscribe(value => {
      if (value === 'increaseWidth') {
        this.renderChart(this.barchartRef.nativeElement.offsetWidth - 110);
      } else if (value === 'decreaseWidth') {
        this.renderChart(this.barchartRef.nativeElement.offsetWidth + 69);
      }
    });
  }

  private renderChart(dynamicWidth: number) {
    if (this.data && this.data.length > 0 && this.creditNotes.length > 0) {
      const fromdate = this.appUtil.getMonthAndYearFromMillis(
        this.creditNotes[0]['creditTransactionDate']
      );
      const toDate = this.appUtil.getMonthAndYearFromMillis(
        this.creditNotes[this.creditNotes.length - 1]['creditTransactionDate']
      );
      const maxMin: object = this.appUtil.getMaxAndMin(this.data);
      const len = JSON.stringify(Math.round(maxMin['max'])).length;
      let maxVal = 0;
      let format = '';
      let titleDesc = '';
      titleDesc = this.translateValues(titleDesc, fromdate, toDate);
      len >= 4 ? (format = 'short') : (format = '#,###');
      let roundLength = 1;
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
        hAxis: {
          textStyle: {
            fontSize: 9
          }
        },
        chartArea: { width: '85%', height: '70%', left: '12%' },
        vAxis: {
          format: format,
          viewWindow: { min: 0, max: maxVal }
        },
        height: 290,
        width: dynamicWidth,
        colors: ['#213DBC'],
        bar: { groupWidth: '30%' }
      };
    }
  }

  private translateValues(titleDesc: string, fromDt: string, todt: string) {
    const modifiedDates = this.getModifiedDates();
    this.translate.get('CREDITNOTES.CHARTTITLE').subscribe(value => {
      titleDesc += value + fromDt;
    });
    this.translate.get('CREDITNOTES.TO').subscribe(value => {
      titleDesc += value + todt;
    });
    return titleDesc;
  }

  private getModifiedDates() {
    let modifiedDates = {};
    let dateRange = 0;
    dateRange = this.appUtil.getDateRangeValue(this.generalService.systemProperties, 'CreditNotesComponent');
    modifiedDates = this.appUtil.modifyDatesForNoData(dateRange);
    return modifiedDates;
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
    const currencyVal = this.appUtil.getCurrencyImage(this.creditNoteCurrency, currencies);
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
      img.crossOrigin = 'anonymous';
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

  private generateCreditNotes(billId: number) {
    this.generalService.getCreditNotes(billId).subscribe(
      creditNotes => {
        this.data = [];
        this.creditNotes = creditNotes;
        if (this.creditNotes && this.creditNotes.length > 0) {
          this.spinner.hide('creditNoteSpinner');
          if (this.noData) {
            this.noData = false;
          }
          let currencyFound = false;
          this.creditNotes.forEach(element => {
            const dataArr = [];
            if (element['currency'] && !currencyFound) {
              currencyFound = true;
              this.creditNoteCurrency = element['currency']['currencyCode'];
            }
            const month = this.appUtil.getMonthFromMillis(
              element['creditTransactionDate']
            );
            const data = element['creditTransactionAmount'];
            const locale = this.settingsService.properties['locale'];
            const numberFormat = this.settingsService.properties['numberFormat'];
            const transformeddata = data === 0 ? 0 : this.decimalPipe.transform(data, numberFormat, locale);
            const currencyVal = this.getCurrencyImage();
            dataArr.push(month);
            dataArr.push(data);
            dataArr.push(currencyVal + transformeddata);
            this.data.push(dataArr);
          });
          this.renderChart(this.barchartRef.nativeElement.offsetWidth);
        } else {
          this.errorMsgs();
        }
      },
      err => {
        this.errorMsgs();
        this.toastr.error(ErrorMessages.TOASTR_CREDIT_NOTES_ERR_MSG);
      }
    );
  }

  private errorMsgs() {
    this.noData = true;
    this.spinner.hide('creditNoteSpinner');
    this.errMsg = ErrorMessages.TOASTR_CREDIT_NOTES_ERR_MSG;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
