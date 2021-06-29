import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../root/components/not-found/not-found.component';
import { BillscreenComponent } from './components/billscreen/billscreen.component';
import { BillViewerComponent } from './components/billscreen/inner-components/bill-viewer/bill-viewer.component';
import { CreateDisputeComponent } from './components/billscreen/inner-components/create-dispute/create-dispute.component';
import { CreditNoteDetailsComponent } from './components/billscreen/inner-components/credit-note-details/credit-note-details.component';
import { RefreshGuardServiceService } from 'src/app/services/refresh-guard-service.service';
import { DisputeFormComponent } from './components/billscreen/inner-components/create-dispute/dispute-form/dispute-form.component';

const billScreenRoutes: Routes = [
  {
    path: '',
      component: BillscreenComponent, canActivate: [RefreshGuardServiceService],
      children: [
        {
          path: '', component: BillViewerComponent , canActivate: [RefreshGuardServiceService]
        },
        {
          path: 'CreateDispute', component: CreateDisputeComponent, canActivate: [RefreshGuardServiceService],
          children: [
            {
              path: 'Create' , component: DisputeFormComponent
            }
          ]
        },
        {
          path: 'CreditNoteDetails', component: CreditNoteDetailsComponent, canActivate: [RefreshGuardServiceService]
        }
      ]
  },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [ RouterModule.forChild(billScreenRoutes) ],
  exports: [ RouterModule ]
})
export class BillScreenRoutingModule {}
