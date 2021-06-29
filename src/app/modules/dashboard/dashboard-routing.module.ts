import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from '../root/components/not-found/not-found.component';
import { RefreshGuardServiceService } from 'src/app/services/refresh-guard-service.service';

const dashboardRoutes: Routes = [
  {
      path: 'Dashboard',
      component: DashboardComponent, canActivate: [RefreshGuardServiceService]
  },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [ RouterModule.forChild(dashboardRoutes) ],
  exports: [ RouterModule ]
})
export class DashboardRoutingModule { }
