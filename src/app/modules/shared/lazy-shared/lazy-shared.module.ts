import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUtils } from 'src/app/utils/app.util';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { NotFoundModule } from '../not-found/not-found.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SearchFilter, OrderByPipe } from '../filter.pipe';

@NgModule({
  declarations: [SearchFilter, OrderByPipe],
  imports: [CommonModule],
  providers: [AppUtils],
  exports : [
    CommonModule,
    NgxSpinnerModule,
    TranslateModule,
    ToastrModule,
    AngularFontAwesomeModule,
    PerfectScrollbarModule,
    FormsModule,
    NotFoundModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SearchFilter,
    OrderByPipe
  ]
})
export class LazySharedModule { }
