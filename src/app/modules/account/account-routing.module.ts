import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../root/components/not-found/not-found.component';
import { RefreshGuardServiceService } from 'src/app/services/refresh-guard-service.service';
import { AccountComponent } from './account.component';

const disputeRoutes: Routes = [
    { path: '', component: AccountComponent, canActivate: [RefreshGuardServiceService], },
    { path: 'Account', component: AccountComponent, canActivate: [RefreshGuardServiceService], },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' }
];

@NgModule({
    imports: [RouterModule.forChild(disputeRoutes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
