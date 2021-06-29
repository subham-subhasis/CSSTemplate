import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { LazyElementsLoaderService, LazyElementsModule } from '@angular-extensions/elements';
import { AccountRoutingModule } from './account-routing.module';
import { LazySharedModule } from '../shared/lazy-shared/lazy-shared.module';



@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    LazyElementsModule,
    LazySharedModule
  ],
  providers:[LazyElementsLoaderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule { }
