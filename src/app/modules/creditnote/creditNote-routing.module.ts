import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../root/components/not-found/not-found.component';
import { RefreshGuardServiceService } from 'src/app/services/refresh-guard-service.service';
import { CreditNoteComponent } from './components/creditNote.component';

const creditRoutes: Routes = [
    { path: '', component: CreditNoteComponent , canActivate: [RefreshGuardServiceService],},
    { path: 'CreditNotes', component: CreditNoteComponent , canActivate: [RefreshGuardServiceService],},
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' }
];

@NgModule({
    imports: [RouterModule.forChild(creditRoutes)],
    exports: [RouterModule]
})
export class CreditNoteRoutingModule { }
