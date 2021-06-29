import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAmountComponent } from './bill-amount.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { AppUtils } from 'src/app/utils/app.util';
import { ToastrModule } from 'ngx-toastr';

describe('BillAmountComponent', () => {
  let component: BillAmountComponent;
  let fixture: ComponentFixture<BillAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillAmountComponent ],
      imports: [NgxSpinnerModule, TranslateModule.forRoot(),
        ToastrModule.forRoot(), HttpClientModule],
      providers:[AppUtils]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
