import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppUtils } from 'src/app/utils/app.util';
import { RequestEndPoint } from '../../dashboard/models/reqEndPoint.interface';
import { GeneralService } from '../../dashboard/services/general.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class CreditNoteService {
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

    getCreditNotesList(reqObj: any) {
        reqObj['screenName'] = 'Credit Notes';
        reqObj['actionName'] = 'Search';
        return this.createRequest('CreditNotesList', reqObj);
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


    downloadCreditNotes(pbipId: number, pcrdId: number) {
        const objToSend = new RequestEndPoint();
        objToSend.setEntityId(JSON.stringify(pbipId));
        objToSend.setRequestEndpoint('BillCreditDownload');
        objToSend.setRequestParam({
            'pcrdId': pcrdId,
            'screenName': 'Credit Notes',
            'actionName': 'Download'
        });
        return this.sendRequest(objToSend);
    }

    private createRequest(endPoint: string, requestObj?: any) {
        const objToSend = new RequestEndPoint();
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
export class DropData {
    label: string;
    value: any;
    isSelected: boolean;
}
export class DropFilter {
    data: Array<DropData>;
    isDropDownVisible: boolean;
    key: string;
    count: number;
    label: string;
}
