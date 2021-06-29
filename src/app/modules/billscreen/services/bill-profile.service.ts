import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppUtils } from 'src/app/utils/app.util';
import { RequestEndPoint } from '../../dashboard/models/reqEndPoint.interface';
import { GeneralService } from '../../dashboard/services/general.service';
import { BillChartModel } from '../../dashboard/models/billchart.model';
import { BehaviorSubject } from 'rxjs';
import { DisputeDetails } from '../models/disputeDetails.model';

@Injectable({
  providedIn: 'root'
})
export class BillProfileService {

  entityId = 0;
  pbilId = 0;
  onChange = new BehaviorSubject<any>('');
  onChangeBillsDisplayEvent = new BehaviorSubject<any>('');
  downloadBillType = new BehaviorSubject<any>('');
  loadBills = new BehaviorSubject<any>('');
  billProfile_Index = {};
  disputeData: BillChartModel;
  disputeTableData: DisputeDetails;
  downloadDropDownData: any;
  billContainerElement: any;
  constructor(private httpClient: HttpClient, private appUtil: AppUtils, private gservice: GeneralService) {
  }

  getBillSearchData(billId: number, filterBy: string, fromDate: any, toDate: any) {
    const objToSend = new RequestEndPoint();
    objToSend.setEntityId(JSON.stringify(billId));
    objToSend.setRequestEndpoint('BillSearch');
    if (filterBy && !fromDate && !toDate) {
      objToSend.setRequestParam({
        'filterBy': filterBy,
        'screenName': 'Bills',
        'actionName': 'Search'
      });
    } else if (filterBy && fromDate && toDate) {
      objToSend.setRequestParam({
        'filterBy': filterBy,
        'fromDttm': fromDate,
        'toDttm': toDate,
        'screenName': 'Bills',
        'actionName': 'Search'
      });
    } else {
      objToSend.setRequestParam({});
    }
    return this.httpClient.post<BillChartModel[]>(this.gservice.commonUrl, objToSend, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getDisputeList(billProfileId: number, pbilId: number) {
    return this.createRequest(billProfileId, pbilId, 'DisputedBill');
  }

  getCreditNotesList(billProfileId: number, pbilId: number) {
    return this.createRequest(billProfileId, pbilId, 'BillCreditList');
  }

  downloadBill(billProfileId: number, pbilId: number) {
    return this.createRequest(billProfileId, pbilId, 'DownloadBill');
  }

  downloadCreditNotes(billProfileId: number, creditId: number) {
    const objToSend = new RequestEndPoint();
    objToSend.setEntityId(JSON.stringify(billProfileId));
    objToSend.setRequestEndpoint('BillCreditDownload');
    objToSend.setRequestParam({
      'pbpdId': billProfileId,
      'pcrdId': creditId,
      'previewfile': true,
      'screenName': 'Bills',
      'actionName': 'Preview'
    });
    return this.sendRequest(objToSend);
    // return this.createRequest(billProfileId, pbilId, 'BillCreditDownload');
  }

  createDispute(billProfileId: number, pbilId: number, amt: number, pbpdId: number, comment: string, disputeReviewByDate: number) {
    const objToSend = new RequestEndPoint();
    objToSend.setEntityId(JSON.stringify(billProfileId));
    objToSend.setRequestEndpoint('CreateDispute');
    objToSend.setRequestParam({
      'dispute': {
        'pbilId': pbilId,
        'pbpdId': pbpdId,
        'disputeAmt': amt,
        'disputeComment': comment,
        disputeReviewByDate
      },
      'screenName': 'Bills',
      'actionName': 'Raise Dispute'
    });
    return this.sendRequest(objToSend);
  }

  updateDispute(billProfileId: number, pbilId: number, amt: number, pbpdId: number, pdisId: number, comment: string, disputeReviewByDate: number) {
    const objToSend = new RequestEndPoint();
    objToSend.setEntityId(JSON.stringify(billProfileId));
    objToSend.setRequestEndpoint('UpdateDispute');
    objToSend.setRequestParam({
      'dispute': {
        'pdisId': pdisId,
        'pbilId': pbilId,
        'pbpdId': pbpdId,
        'disputeAmt': amt,
        'disputeComment': comment,
        disputeReviewByDate
      },
      'screenName': 'Bills',
      'actionName': 'Edit Dispute'
    });
    return this.sendRequest(objToSend);
  }


  private createRequest(billProfileId: number, pbilId: number, endPoint: string) {
    const objToSend = new RequestEndPoint();
    objToSend.setEntityId(JSON.stringify(billProfileId));
    objToSend.setRequestEndpoint(endPoint);
    if (endPoint === 'DownloadBill') {
      objToSend.setRequestParam({
        'pbilId': pbilId,
        'previewfile': true,
        'screenName': 'Bills',
        'actionName': 'Preview'
      });
    } else {
      objToSend.setRequestParam({
        'pbilId': pbilId,
        'screenName': 'Bills',
        'actionName': 'Search'
      });
    }
    return this.sendRequest(objToSend);
  }


  private sendRequest(objToSend: RequestEndPoint) {
    return this.httpClient.post<any>(this.gservice.commonUrl, objToSend, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
