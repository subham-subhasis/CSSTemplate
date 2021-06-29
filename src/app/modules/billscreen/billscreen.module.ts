import { NgModule } from '@angular/core';
import { BillscreenComponent } from './components/billscreen/billscreen.component';
import { BillScreenRoutingModule } from './billscreen-routing.module';
import { BilldetailsComponent } from './components/billscreen/inner-components/billdetails/billdetails.component';
import { BillListSharedModule } from '../shared/billList/billlist-shared.module';
import { LazySharedModule } from '../shared/lazy-shared/lazy-shared.module';
import { BillViewerComponent } from './components/billscreen/inner-components/bill-viewer/bill-viewer.component';
import { CreateDisputeComponent } from './components/billscreen/inner-components/create-dispute/create-dispute.component';
import { CreditNoteDetailsComponent } from './components/billscreen/inner-components/credit-note-details/credit-note-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DisputeFormComponent } from './components/billscreen/inner-components/create-dispute/dispute-form/dispute-form.component';
import { StopPropgationDirective } from './directives/stop-propgation.directive';
import { SafePipe } from 'src/app/filters/safeurlpipe';
import { MatIconModule } from '@angular/material';
@NgModule({
  declarations: [BillscreenComponent, BilldetailsComponent, BillViewerComponent,
     CreateDisputeComponent, CreditNoteDetailsComponent, DisputeFormComponent, StopPropgationDirective,
     SafePipe
    ],
  imports: [
    BillListSharedModule, LazySharedModule,
    BillScreenRoutingModule, ReactiveFormsModule,
    MatIconModule
  ],
  exports: [
    BillscreenComponent
  ]
})
export class BillscreenModule { }
