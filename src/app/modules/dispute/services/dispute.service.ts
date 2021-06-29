import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppUtils } from 'src/app/utils/app.util';
import { RequestEndPoint } from '../../dashboard/models/reqEndPoint.interface';
import { GeneralService } from '../../dashboard/services/general.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { of } from 'rxjs';

@Injectable()
export class DisputeService {
    disputeSubject = new BehaviorSubject<any>({});
    commonUrl = '';
    entityId = 0;
    pbilId = 0;
    headerProperties = {};
    userAccountsData = [];
    constructor(private httpClient: HttpClient, private appUtil: AppUtils, private gservice: GeneralService) {
        this.headerProperties = this.gservice.headerProperties;
        this.commonUrl = this.gservice.commonUrl;
        this.userAccountsData = this.gservice.userAccountsData;
    }
    getDaterange() {
        return this.appUtil.getDateRangeValue(this.gservice.systemProperties, 'BillSearch');
    }

    getAccountsList() {
        if (this.userAccountsData && this.userAccountsData.length) {
            this.userAccountsData.forEach(element => {
                element.isSelected = false;
            });
            return of(this.userAccountsData);
        }
        return this.createRequest('AccountList', {}).pipe(
            map(rsep => {
                const accData: Array<DropData> = [];
                if (rsep && Array.isArray(rsep) && rsep.length) {
                    rsep.forEach(item => {
                        accData.push({ label: item.paccName, isSelected: false, value: item.paccId });
                    });
                }
                return accData;
            })
        );
    }
    getStatusCode() {
        return this.createRequest('DisputeStatus', { billType: 'Dispute' }).pipe(
            map(rsep => {
                const statusData: Array<DropData> = [];
                if (rsep && Array.isArray(rsep) && rsep.length) {
                    rsep.forEach(item => {
                        statusData.push({ label: item.pscdDisplay, isSelected: false, value: item.pscdId });
                    });
                }
                return statusData;
            })
        );
    }
    getBillProfileList(reqObj: any) {
        return this.createRequest('BillList', reqObj).pipe(
            map(rsep => {
                const billProfData: Array<DropData> = [];
                if (rsep && Array.isArray(rsep) && rsep.length) {
                    rsep.forEach(item => {
                        billProfData.push({ label: item.billProfileName, isSelected: false, value: item.pbipId });
                    });
                }
                return billProfData;
            })
        );
    }

    getBillsFromBillProf(billProfId) {
        return this.createRequest('BillSearch', { pbipId: billProfId }, billProfId).pipe(
            map(rsep => {
                if (rsep && Array.isArray(rsep) && rsep.length) {
                    return rsep;
                }
            })
        );
    }

    getDisputeList(reqObj: any) {
        reqObj['screenName'] = 'Dispute';
        reqObj['actionName'] = 'Search';
        return this.createRequest('DisputedBill', reqObj);
    }

    createDispute(pdisId: number, billProfileId: number, pbilId: number, amt: number, pbpdId: number, comment: string, disputeReviewByDate: number) {
        const objToSend = new RequestEndPoint();
        objToSend.setEntityId(JSON.stringify(billProfileId));
        if (pdisId) {
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
                'screenName': 'Dispute',
                'actionName': 'Edit Dispute'
            });
        } else {
            objToSend.setRequestEndpoint('CreateDispute');
            objToSend.setRequestParam({
                'dispute': {
                    'pbilId': pbilId,
                    'pbpdId': pbpdId,
                    'disputeAmt': amt,
                    'disputeComment': comment,
                    disputeReviewByDate
                },
                'screenName': 'Dispute',
                'actionName': 'Raise Dispute'
            });
        }
        return this.sendRequest(objToSend);
    }

    private createRequest(endPoint: string, requestObj?: any, entityId?: any) {
        const objToSend = new RequestEndPoint();
        if (entityId) { objToSend.setEntityId(JSON.stringify(entityId)); }
        objToSend.setRequestEndpoint(endPoint);
        objToSend.setRequestParam(requestObj);
        return this.sendRequest(objToSend);
    }


    private sendRequest(objToSend: RequestEndPoint) {
        return this.httpClient.post<any>(this.commonUrl, objToSend, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

}

export class DropFilter {
    data: Array<DropData>;
    isDropDownVisible: boolean;
    key: string;
    count: number;
    label: string;
}
export class DropData {
    label: string;
    value: any;
    isSelected: boolean;
}
