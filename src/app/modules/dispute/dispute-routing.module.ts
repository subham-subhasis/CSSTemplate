import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../root/components/not-found/not-found.component';
import { RefreshGuardServiceService } from 'src/app/services/refresh-guard-service.service';
import { DisputeComponent } from './components/dispute-list/dispute.component';
import { DisputeCreateComponent } from './components/dispute-create/dispute-create.component';

const disputeRoutes: Routes = [
    { path: '', component: DisputeComponent, canActivate: [RefreshGuardServiceService], },
    { path: 'Dispute', component: DisputeComponent, canActivate: [RefreshGuardServiceService], },
    { path: 'DisputeCreate', component: DisputeCreateComponent, canActivate: [RefreshGuardServiceService], },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' }
];

@NgModule({
    imports: [RouterModule.forChild(disputeRoutes)],
    exports: [RouterModule]
})
export class DisputeRoutingModule { }
