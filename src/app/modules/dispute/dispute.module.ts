import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisputeComponent } from './components/dispute-list/dispute.component';
import { LazySharedModule } from '../shared/lazy-shared/lazy-shared.module';
import { DisputeRoutingModule } from './dispute-routing.module';
import { DisputeService } from './services/dispute.service';
import { DisputeCreateComponent } from './components/dispute-create/dispute-create.component';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [DisputeComponent, DisputeCreateComponent],
  imports: [
    CommonModule,
    DisputeRoutingModule,
    LazySharedModule,
    FormsModule,
    TableModule,
    TooltipModule
  ],
  exports: [
  ],
  providers: [DisputeService]
})
export class DisputeModule { }

