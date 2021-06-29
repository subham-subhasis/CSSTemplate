import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillscreenComponent } from './billscreen.component';
import { BillListSharedModule } from 'src/app/modules/shared/billList/billlist-shared.module';
import { BilldetailsComponent } from './inner-components/billdetails/billdetails.component';
import { LazySharedModule } from 'src/app/modules/shared/lazy-shared/lazy-shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('BillscreenComponent', () => {
  let component: BillscreenComponent;
  let fixture: ComponentFixture<BillscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillscreenComponent, BilldetailsComponent ],
      imports: [BillListSharedModule, LazySharedModule,
      RouterTestingModule, HttpClientModule,
      TranslateModule.forRoot()],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
