import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BilldetailsComponent } from './billdetails.component';
import { LazySharedModule } from 'src/app/modules/shared/lazy-shared/lazy-shared.module';
import { BillListSharedModule } from 'src/app/modules/shared/billList/billlist-shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

describe('BilldetailsComponent', () => {
  let component: BilldetailsComponent;
  let fixture: ComponentFixture<BilldetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BilldetailsComponent ],
      imports: [LazySharedModule, BillListSharedModule, RouterTestingModule,
      HttpClientModule, TranslateModule.forRoot()],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BilldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
