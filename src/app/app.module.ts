import { Title, BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NgZone, APP_INITIALIZER } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { RedirectInterceptor } from './interceptors/redirect-interceptor';
import { SharedModule } from './modules/shared/shared.module';
import { RootModule } from './modules/root/root.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { SettingsService } from './services/settings.service';
import { LazyElementsLoaderService, LazyElementsModule } from '@angular-extensions/elements';
import { ApiConfigService } from './config.service';
import { AccountModule } from './modules/account/account.module';
import { InterceptorProviders } from './interceptors/interceptor';
import { DashboardV2Module } from './modules/dashboard-v2/dashboard-v2.module';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    RootModule,
    // DashboardModule,
    DashboardV2Module,
    LazyElementsModule,
    AccountModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    Title,
    ToastrService,
    LazyElementsLoaderService,
    InterceptorProviders,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (config: SettingsService) => () => config.setLanguageFromProperty(),
      deps: [SettingsService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ApiConfigService) => () => config.loadUrlConfiguration(),
      deps: [ApiConfigService],
      multi: true
    },
    SettingsService,
    DatePipe, DecimalPipe, CurrencyPipe],
  bootstrap: [AppComponent],
  exports: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private ngZone: NgZone) {
    (window as any).ngZone = this.ngZone;
  }

}
