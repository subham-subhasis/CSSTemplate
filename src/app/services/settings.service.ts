import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { map } from 'rxjs/internal/operators/map';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private httpClient: HttpClient,
    private translate: TranslateService) { }
  properties: any;
  get applicationProperties() {
    return this.properties;
  }
  PER_PAGE_COUNT = 0;
  setLanguage() {
    return this.httpClient.get('./assets/json/propertyFile.json').pipe(
      map((data) => {
        this.properties = data;
        let locale: string = data['locale'];
        locale = locale.indexOf('-') > 0 ?
          locale.substring(0, locale.indexOf('-')) : locale;
        const readFromProperty: boolean = data['readFromProperty'];
        if (locale !== 'en' && readFromProperty) {
          this.importLocalejs(locale);
        } else {
          const browserLocale = navigator.language.indexOf('-') > 0 ?
            navigator.language.substring(0, navigator.language.indexOf('-')) : 'en';
          if (browserLocale !== 'en') {
            this.importLocalejs(browserLocale);
          }
          this.properties['locale'] = browserLocale;
        }
        this.translate.setDefaultLang(this.properties.locale);
      }));
  }

  setLanguageFromProperty() {
    return new Promise((resolve, reject) => {
      this.httpClient.get('./assets/json/propertyFile.json').subscribe((data: any) => {
        this.properties = data;
        let locale: string = data['locale'];
        locale = locale.indexOf('-') > 0 ?
          locale.substring(0, locale.indexOf('-')) : locale;
        const readFromProperty: boolean = data['readFromProperty'];
        if (locale !== 'en' && readFromProperty) {
          this.importLocalejs(locale);
        } else {
          const browserLocale = navigator.language.indexOf('-') > 0 ?
            navigator.language.substring(0, navigator.language.indexOf('-')) : 'en';
          if (browserLocale !== 'en') {
            this.importLocalejs(browserLocale);
          }
          this.properties['locale'] = browserLocale;
        }
        if (data) {
          resolve(true);
        } else {
          reject('error');
        }
        // this.translate.setDefaultLang(this.properties.locale);
      });
    });
  }

  private importLocalejs(locale: string) {
    import(/* webpackInclude: /(fr|hi)\.js$/ */ `@angular/common/locales/${locale.toLocaleLowerCase()}.js`).
      then(localeData => {
        registerLocaleData(localeData.default);
      });
  }
}
