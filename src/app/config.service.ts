import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ApiConfigService {

    constructor(private httpClient: HttpClient, private translateService: TranslateService) { }
    // tslint:disable-next-line: member-ordering
    static localeId = '';
    static urls: any = {};
    static authProperties = {};
    static apiConfig = {} as any;
    properties: Object;
    // loadUrlConfiguration() {
    //     return new Promise((resolve, reject) => {
    //         this.httpClient.get('./assets/json/applicationConfiguraion.json').subscribe((response: any) => {
    //             ApiConfigService.authProperties = response[0].authProperties;
    //             if (environment.production) {
    //                 ApiConfigService.urls = response[0].prod;
    //             } else {
    //                 ApiConfigService.urls = response[0].dev;
    //             }
    //             if (response) {
    //                 resolve(true);
    //             } else {
    //                 reject('error');
    //             }
    //         });
    //     });
    // }
    loadUrlConfiguration() {
        return new Promise((resolve, reject) => {
            forkJoin([this.httpClient.get('./assets/json/applicationConfiguraion.json'),
            this.httpClient.get('./assets/conf/api.config.json')]).subscribe((response: any) => {
                let applicationConfiguraion = response[0];
                ApiConfigService.apiConfig = response[1];
                ApiConfigService.authProperties = applicationConfiguraion[0].authProperties;
                if (environment.production) {
                    ApiConfigService.urls = applicationConfiguraion[0].prod;
                } else {
                    ApiConfigService.urls = applicationConfiguraion[0].dev;
                }
                if (response) {
                    resolve(true);
                } else {
                    reject('error');
                }
            });
        });
    }
}
