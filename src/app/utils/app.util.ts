import { format } from 'util';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import * as FileSaver from 'file-saver';
@Injectable()
export class AppUtils {

  constructor(private datePipe: DatePipe, private settingsService: SettingsService) { }

  public getDateFromMillis(date: number) {
    const originalDate = new Date(date);
    const month = format(originalDate.getMonth() + 1);
    const day = format(originalDate.getDate());
    const year = format(originalDate.getFullYear());
    return month + '/' + day + '/' + year;
  }

  public getHrsMinSecFromMillis(date: number) {
    const originalDate = new Date(date);
    const hrs = format(originalDate.getHours());
    const min = format(originalDate.getMinutes());
    const sec = format(originalDate.getSeconds());
    return `${hrs}:${min}:${sec}`;
  }

  public getMonthAndYearFromMillis(date: number) {
    const originalDate = new Date(date);
    const locale = this.settingsService.properties['locale'] ? this.settingsService.properties['locale'] : 'en';
    const modifiedDate = this.datePipe.transform(originalDate, 'MMM yyyy', '', locale);
    return modifiedDate;
  }

  public getDifferenceFromCurrentDate(dateInMilis: number) {
    const dueDate = new Date(dateInMilis);
    const systemdate = new Date();
    const diff = dueDate.getTime() - systemdate.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays;
  }

  public getMonthFromMillis(date: number) {
    const originalDate = new Date(date);
    const locale = this.settingsService.properties['locale'];
    const modifiedDate = this.datePipe.transform(originalDate, 'MMM', '', locale);
    return modifiedDate;
  }

  public getCurrencyImage(key: string, data: object[]) {
    let found = false;
    let value: any;
    data.forEach((currency) => {
      if (currency['code'] === key && !found) {
        found = true;
        value = currency['symbol'];
      }
    });
    return value;
  }

  public getMaxAndMin(array: Array<any>) {
    const maxAndMin = {};
    maxAndMin['max'] = Math.max.apply(Math, array.map(function (o: Array<any>) { return o[1]; }));
    maxAndMin['min'] = Math.min.apply(Math, array.map(function (o: Array<any>) { return o[1]; }));
    return maxAndMin;
  }

  public generateDynamicUrl(href: string) {
    let path = '';
    const split_one = href.split(':');
    const split2 = split_one[split_one.length - 1].split('/');
    if (split2.length > 0) {
      path = split2[1];
    }
    return path;
  }

  public appendCurrencySign(axisLabels: HTMLCollection[], currImg: any) {
    if (!currImg) {
      currImg = '';
    }
    if (axisLabels && axisLabels.length > 0) {
      for (let counter1 = 0; counter1 < axisLabels.length; counter1++) {
        const attributes: [] = axisLabels[counter1]['attributes'];
        if (attributes && attributes.length > 0) {
          for (let counter2 = 0; counter2 < attributes.length; counter2++) {
            if (attributes[counter2]['nodeName'] === 'text-anchor' && attributes[counter2]['nodeValue'] === 'end') {
              axisLabels[counter1]['innerHTML'] = currImg + axisLabels[counter1]['innerHTML'];
            }
          }
        }
      }
    }
  }

  public embedPDF(data: any) {
    if (data['fileType'] !== 'pdf') {
      return;
    }
    const obj = document.createElement('object');
    obj.style.width = '100%';
    obj.style.height = 'calc(100vh - 145px)';
    obj.type = 'application/pdf';
    obj.data = 'data:application/pdf;base64,' + data['fileData'] + '#toolbar=0&navpanes=0';
    const domEl = document.querySelector('.bill_box');
    domEl.appendChild(obj);
  }

  public modifyDatesForNoData(difference: number) {
    const modifiedDates = {};
    const toDate = new Date();
    toDate.setDate(1);
    toDate.setHours(-1);
    const fromDate = new Date(toDate);
    fromDate.setMonth(toDate.getMonth() - difference);
    const { modifiedFromDate, modifiedToDate } = this.filterDate(toDate, fromDate);
    modifiedDates['frmDate'] = modifiedFromDate;
    modifiedDates['toDate'] = modifiedToDate;
    return modifiedDates;
  }

  public filterDate(toDate: Date, fromDate: Date) {
    const locale = this.settingsService.properties['locale'];
    const modifiedToDate = this.datePipe.transform(toDate, 'MM/dd/yyyy', '', locale);
    const modifiedFromDate = this.datePipe.transform(fromDate, 'MM/dd/yyyy', '', locale);
    return { modifiedFromDate, modifiedToDate };
  }

  public getDateRangeValue(systemProperties: object[], componentName: string) {
    let returnValue = 0;
    systemProperties.forEach((data) => {
      let component = '';
      if (componentName === data['componentName']) {
        component = data['componentName'];
      }
      switch (component) {
        case ('BillSearch'):
          if (data['propertyName'] && data['propertyName'] === 'daterange') {
            returnValue = data['propertyValues'] ? +data['propertyValues'] : 0;
          }
          break;

        case ('CreditNotesComponent'):
          if (data['propertyName'] && data['propertyName'] === 'dttmInterval') {
            returnValue = data['propertyValues'] ? +data['propertyValues'] : 0;
          }
          break;

        case ('BillViewComponent'):
          if (data['propertyName'] && data['propertyName'] === 'dttmInterval') {
            returnValue = data['propertyValues'] ? +data['propertyValues'] : 0;
          }
          break;

        case ('DisputeAmountComponent'):
          if (data['propertyName'] && data['propertyName'] === 'dttmInterval') {
            returnValue = data['propertyValues'] ? +data['propertyValues'] : 0;
          }
          break;
      }
    });
    return returnValue;
  }

  public prepareFrame(src: string) {
    const bbox = document.querySelector('.bill_box');
    const ifrm = document.createElement('iframe');
    ifrm.setAttribute('src', src);
    ifrm.style.width = '100%';
    ifrm.style.height = '69vh';
    bbox.appendChild(ifrm);
  }

  downloadPdf(pdfName: string, base64dataPDF: any) {
    const linkSource = `data:application/pdf;base64,${base64dataPDF}`;
    const downloadLink = document.createElement('a');
    const fileName = pdfName;
    downloadLink.href = linkSource;
    document.body.appendChild(downloadLink);
    downloadLink.download = fileName;
    downloadLink.click();
    document.body.removeChild(downloadLink);
    // this.billProfileService.downloadBillType.next('');
  }
  
  encryptData(data: any) {
    return data && data !== 'null' ? window.btoa(JSON.stringify(data)) : null;
  }

  decryptData(data: any) {
    return data && data !== 'null' ? JSON.parse(window.atob(data)) : null;
  }

  exportTempDocument(imageData: any, fileName: string) {
    FileSaver.saveAs(imageData, fileName);
  }

  downloadExcel(excelName: string, base64dataXlsx: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64dataXlsx}`;
    const downloadLink = document.createElement('a');
    const fileName = excelName;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    // this.billProfileService.downloadBillType.next('');
  }

  disableStyle(styleName) {
    const styles = document.styleSheets;
    let href = [];
    for (let i = 0; i < styles.length; i++) {
      if (!styles[i].href) {
        continue;
      }
      href = styles[i].href.split("/");
      href = href[href.length - 1];
      if (href === styleName) {
        styles[i].disabled = true;
        break;
      }
    }
  }

  enableStyle(styleName) {
    const styles = document.styleSheets;
    let href = [];
    for (let i = 0; i < styles.length; i++) {
      if (!styles[i].href) {
        continue;
      }
      href = styles[i].href.split("/");
      href = href[href.length - 1];
      if (href === styleName) {
        styles[i].disabled = false;
        break;
      }
    }
  }

  sortMethod(array: Array<any>, field: any, isNumber: boolean, type: 'asc' | 'dsc') {
    if (field) {
      switch (type) {
        case 'asc': {
          if (!isNumber) {
            array.sort((a, b) => {
              return (a[field] < b[field]) ? -1 : ((a[field] > b[field]) ? 1 : 0);
            });
          } else if (isNumber) {
            array.sort((a, b) => {
              return Number(a[field]) - Number(b[field]);
            });
          }
          break;
        }
        case 'dsc': {
          if (!isNumber) {
            array.sort((a, b) => {
              return (a[field] > b[field]) ? -1 : ((a[field] < b[field]) ? 1 : 0);
            });
          } else if (isNumber) {
            array.sort((a, b) => {
              return Number(b[field]) - Number(a[field]);
            });
          }
          break;
        }
      }
    } else {
      switch (type) {
        case 'asc': {
          if (!isNumber) {
            array.sort((a, b) => {
              return (a < b) ? -1 : ((a > b) ? 1 : 0);
            });
          } else if (isNumber) {
            array.sort((a, b) => {
              return Number(a) - Number(b);
            });
          }
          break;
        }
        case 'dsc': {
          if (!isNumber) {
            array.sort((a, b) => {
              return (a > b) ? -1 : ((a < b) ? 1 : 0);
            });
          } else if (isNumber) {
            array.sort((a, b) => {
              return Number(b) - Number(a);
            });
          }
          break;
        }
      }
    }


  }

}
