import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AppUtils } from 'src/app/utils/app.util';
import { BillListComponent } from '../../dashboard/components/dashboard/widgets/bill-list/bill-list.component';
import { FilterPipe } from '../../dashboard/filters/filterpipe';

@NgModule({
  declarations: [BillListComponent, FilterPipe],
  imports: [PerfectScrollbarModule, TranslateModule, FormsModule, CommonModule],
  providers: [AppUtils],
  exports: [
    BillListComponent
  ]
})
export class BillListSharedModule { }
