import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GeneralService } from '../../dashboard/services/general.service';
import { environment } from 'src/environments/environment';
import { AppUtils } from 'src/app/utils/app.util';
import { ActivityRequest } from '../models/request.model';
import { map } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/config.service';
import { SettingsService } from 'src/app/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class RootService {
  onMenuClick = new BehaviorSubject<any>(false);
  auditUrl = '';
  constantData: any;
  constructor(private httpClient: HttpClient, private generalService: GeneralService, private appUtils: AppUtils, private settingService: SettingsService) { 

  }

  getAuditData(reqObj: ActivityRequest) {
    return this.sendRequest(reqObj);
  }

  getConstantsJson() {
    return this.httpClient.get('./assets/json/constants.json').pipe(
      map((data) => {
        this.constantData = data;
        return data;
      })
    );
  }

  getPartnerInfos(requestId: string) {
    const url = ApiConfigService.urls['partnerinfos'];
    const params = new HttpParams().set('requestNumber', requestId);
    return this.httpClient.get(url, { params });
  }

  private sendRequest(objToSend: any) {
    return this.httpClient.post<any>(this.generalService.auditUrl, objToSend, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
