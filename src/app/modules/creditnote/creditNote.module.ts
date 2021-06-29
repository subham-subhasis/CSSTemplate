import { NgModule } from '@angular/core';
import { LazySharedModule } from '../shared/lazy-shared/lazy-shared.module';
import { CreditNoteComponent } from './components/creditNote.component';
import { CreditNoteRoutingModule } from './creditNote-routing.module';
import { CreditNoteService } from './services/creditNote.service';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    declarations: [CreditNoteComponent],
    imports: [
        CreditNoteRoutingModule,
        LazySharedModule,
        TableModule,
        TooltipModule
    ],
    exports: [
    ],
    providers: [CreditNoteService]
})
export class CreditNoteModule { }
