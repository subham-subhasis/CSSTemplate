import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { DynamicWidgetDirective } from './directives/dynamic-widget.directive';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WidgetsComponent } from './components/dashboard/widgets/widgets.component';
import { BillAmountComponent } from './components/dashboard/widgets/bill-amount/bill-amount.component';
import { BillViewComponent } from './components/dashboard/widgets/bill-view/bill-view.component';
import { CreditNotesComponent } from './components/dashboard/widgets/credit-notes/credit-notes.component';
import { DisputeAmountComponent } from './components/dashboard/widgets/dispute-amount/dispute-amount.component';
import { BillListSharedModule } from '../shared/billList/billlist-shared.module';

@NgModule({
  declarations: [
    WidgetsComponent,
    BillAmountComponent,
    BillViewComponent,
    CreditNotesComponent,
    DisputeAmountComponent,
    DynamicWidgetDirective,
    DashboardComponent
  ],
  imports: [
    SharedModule,
    GoogleChartsModule.forRoot(),
    BillListSharedModule
  ],
  entryComponents: [
    BillAmountComponent, BillViewComponent, CreditNotesComponent,
    DisputeAmountComponent
  ],
  exports: [
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
