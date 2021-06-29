import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/config.service';
import { GeneralService } from '../../dashboard/services/general.service';
import { SharedService } from '../../shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient, private generalService: GeneralService, private sharedService: SharedService) { }

  getBillProfileDetail(billProfIds: Array<any>) {
    const baseUrl: any = ApiConfigService.apiConfig.apiUrl;
    const url = `${baseUrl}/billProfiles?billProfileIds=${billProfIds.toString()}`
    return this.httpClient.get(url);
  }

  getUploadedFilesData(billProfId?: number) {
    const baseUrl: any = ApiConfigService.apiConfig.apiUrl;
    if (billProfId) {
      return this.httpClient.get(`${baseUrl}/accountFileUpload/0/${billProfId}`);
    }
    const userAccountsData = this.generalService.userAccountsData;
    const acctIdArray = userAccountsData.map(a => a.value);
    let params = new HttpParams();

    acctIdArray.forEach((acctId: string) => {
      params = params.append(`listAllAccountIds`, acctId);
    })
    params = params.append(`username`, "");
    params = params.append(`screenName`, "Dashboard");
    return this.httpClient.get(`${baseUrl}/accountFileUpload`, { params });
  }

  getAllBillProfiles() {
    return this.generalService.getAccountsListMap().pipe(
      switchMap(resp => {
        return this.generalService.getBillList();
      }),
      map(resp => {
        this.sharedService.billList = resp;
        this.sharedService.isAuthorized = true;
        return resp;
      })
    )
  }

  getUserDetailsByUserName(userName:string){
    const userManagementBaseUrl: any = ApiConfigService.urls['userInfoUrl'];
    return  this.httpClient.get(`${userManagementBaseUrl}?filter=${userName}`);
  }

  getPartnerInfos(filterObjArray:Array<any>){
    const partnerInfoUrl: any = ApiConfigService.urls['partnerinfos'];
    return  this.httpClient.post(`${partnerInfoUrl}/0/10?filterCreatedFromDate=&filterCreatedToDate=`,filterObjArray);
  }

}
