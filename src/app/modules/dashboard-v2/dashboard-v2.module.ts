import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardV2Component } from './components/dashboard/dashboard-v2.component';
import { SharedModule } from '../shared/shared.module';
import { LazySharedModule } from '../shared/lazy-shared/lazy-shared.module';


@NgModule({
  declarations: [DashboardV2Component],
  imports: [
    CommonModule,
    SharedModule,
    LazySharedModule
  ]
})
export class DashboardV2Module {

 }
