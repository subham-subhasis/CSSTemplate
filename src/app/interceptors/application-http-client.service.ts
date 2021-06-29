import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionInfo } from './SessionInfo';
import { ApiConfigService } from 'src/app/config.service';
import { environment } from 'src/environments/environment';
import { SettingsService } from '../services/settings.service';
import { AppUtils } from '../utils/app.util';
import { GeneralService } from '../modules/dashboard/services/general.service';


@Injectable({
    providedIn: 'root'
})
export class ApplicationHttpClientService {

    private sessionInfo: SessionInfo;
    private token: any;

    constructor(public http: HttpClient, private settingService: SettingsService,
        private appUtil: AppUtils, private generalService: GeneralService,
        private apiConfigService: ApiConfigService) {
    }

    public setSessionInfo(sessionInfo: SessionInfo): void {
        this.sessionInfo = sessionInfo;
    }

    public validateParentSession(sessionInfo: SessionInfo): Observable<any> {
        return this.updateLoginActionTime(sessionInfo);
    }

    checkServer() {
        let url: string = '';
        if (environment.production) {
            const href: string = window.location.href;
            const path = this.appUtil.generateDynamicUrl(href);
            const host = window.location.host;
            const protocol = this.settingService.applicationProperties['protocol'];
            url = `${protocol}://${host}/${path}/ppservices/common/awakeServer`;
        } else {
            url = 'http://localhost:8090/PartnerManagement/ppservices/common/awakeServer';
        }
        return this.http.get(url);
    }

    updateLoginActionTime(params: SessionInfo) {
        let url: string = '';
        if (environment.production) {
            const href: string = window.location.href;
            const path = this.appUtil.generateDynamicUrl(href);
            const host = window.location.host;
            const protocol = this.settingService.applicationProperties['protocol'];
            url = `${protocol}://${host}/${path}/ppservices/common/updatesessiongettoken`;
        } else {
            url = 'http://localhost:8090/PartnerManagement/ppservices/common/updatesessiongettoken';
        }
        return this.http.post(url, params);
    }

    public getUpdateTokenURLandParams() {
        const params = new SessionInfo();
        params.productIdentifier = ApiConfigService.authProperties['productIdentifier'];
        params.userId = this.generalService.userId;
        let url: string = '';
        if (environment.production) {
            const href: string = window.location.href;
            const path = this.generateDynamicUrl(href);
            const host = window.location.host;
            const protocol = this.settingService.properties['protocol'];
            url = `${protocol}://${host}/${path}/ppservices/common/updatesessiongettoken`;
        } else {
            url = 'http://localhost:8090/PartnerManagement/ppservices/common/updatesessiongettoken';
        }
        return { url, params };
    }

    private generateDynamicUrl(href: string) {
        let path = '';
        const split_one = href.split(':');
        const split2 = split_one[split_one.length - 1].split('/');
        if (split2.length > 0) {
            path = split2[1];
        }
        return path;
    }

    setToken(token: any) {
        this.token = token;
    }

    getToken(): any {
        return this.token;
    }
}
