import { ChangePasswordComponent } from './modules/root/components/change-password/change-password.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './modules/root/components/not-found/not-found.component';
import { DashboardComponent } from './modules/dashboard/components/dashboard/dashboard.component';
import { HelpComponent } from './modules/root/components/help/help.component';
import { PersonalSettingsComponent } from './modules/root/components/personal-settings/personal-settings.component';
import { RefreshGuardServiceService } from './services/refresh-guard-service.service';
import { ActivityLogComponent } from './modules/root/components/activity-log/activity-log.component';
import { RegistrationComponent } from './modules/root/components/registration/registration.component';
import { SetPasswordComponent } from './modules/root/components/set-password/set-password.component';
import { WorkflowComponent } from './modules/root/components/workflow/workflow.component';
import { DocumentsComponent } from './modules/root/components/documents/documents.component';
import { DashboardV2Component } from './modules/dashboard-v2/components/dashboard/dashboard-v2.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'Dashboard', component: DashboardV2Component },
  { path: 'registration', component: RegistrationComponent },
  { path: 'newPassword', component: SetPasswordComponent },
  { path: 'newPassword:username', component: SetPasswordComponent },
  { path: 'workflow', component: WorkflowComponent },
  { path: 'workflow:requestnumber', component: WorkflowComponent },
  { path: 'ChangePassword', component: ChangePasswordComponent, canActivate: [RefreshGuardServiceService], },
  { path: 'PersonalSettings', component: PersonalSettingsComponent, canActivate: [RefreshGuardServiceService], },
  { path: 'ActivityLog', component: ActivityLogComponent, canActivate: [RefreshGuardServiceService], },
  { path: 'ManageDocuments', component: DocumentsComponent, canActivate: [RefreshGuardServiceService] },
  {
    path: 'Bills/BillViewer', loadChildren: () =>
      import('./modules/billscreen/billscreen.module').then(
        m => m.BillscreenModule
      )
  },
  { path: 'Help', component: HelpComponent, canActivate: [RefreshGuardServiceService], },
  {
    path: 'CreditNotes', loadChildren: () =>
      import('./modules/creditnote/creditNote.module').then(
        c => c.CreditNoteModule
      )
  },
  {
    path: 'Dispute', loadChildren: () =>
      import('./modules/dispute/dispute.module').then(
        d => d.DisputeModule
      )
  },
  {
    path: 'ManageAccount', loadChildren: () =>
      import('./modules/account/account.module').then(
        m => m.AccountModule
      )
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
