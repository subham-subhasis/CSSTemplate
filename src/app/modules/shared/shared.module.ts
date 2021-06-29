import { NotFoundComponent } from './../root/components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppUtils } from 'src/app/utils/app.util';
import { TranslateModule } from '@ngx-translate/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NotFoundModule } from './not-found/not-found.module';
import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { LazySharedModule } from './lazy-shared/lazy-shared.module';
import { MSPopoverModule } from './popover/popover.module';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, MSPopoverModule],
  providers: [AppUtils],
  exports: [
    CommonModule,
    AppRoutingModule,
    NgxSpinnerModule,
    TranslateModule,
    AngularFontAwesomeModule,
    PerfectScrollbarModule,
    NotFoundModule,
    AmChartsModule,
    // TableModule,
    LazySharedModule,
    MSPopoverModule,
    MaterialModule
  ]
})
export class SharedModule { }
