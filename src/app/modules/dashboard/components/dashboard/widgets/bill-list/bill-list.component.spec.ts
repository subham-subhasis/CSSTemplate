import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillListComponent } from './bill-list.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from 'src/app/modules/dashboard/filters/filterpipe';
import { HttpClientModule } from '@angular/common/http';
import { AppUtils } from 'src/app/utils/app.util';
import { RouterTestingModule } from '@angular/router/testing';
import { BillModel } from 'src/app/modules/dashboard/models/bill.model';

describe('BillListComponent', () => {
  let component: BillListComponent;
  let fixture: ComponentFixture<BillListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillListComponent, FilterPipe ],
      imports: [FormsModule, NgxSpinnerModule, PerfectScrollbarModule, TranslateModule.forRoot(),
      HttpClientModule, RouterTestingModule],
      providers: [AppUtils]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillListComponent);
    const tempArr = [];
    tempArr.push(new BillModel());
    component = fixture.componentInstance;
    component.billList = tempArr;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
