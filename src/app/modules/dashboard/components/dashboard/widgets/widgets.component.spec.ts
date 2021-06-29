import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsComponent } from './widgets.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BillListSharedModule } from 'src/app/modules/shared/billList/billlist-shared.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BillModel } from '../../../models/bill.model';
import { SimpleChanges } from '@angular/core';

describe('WidgetsComponent', () => {
  let component: WidgetsComponent;
  let fixture: ComponentFixture<WidgetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetsComponent ],
      imports: [NgxSpinnerModule, BillListSharedModule, HttpClientModule,
        RouterTestingModule, TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsComponent);
    component = fixture.componentInstance;
    const object1 =  {};
    const typesArr = [];
    const billObj = new BillModel();
    const billArr = [];
    billArr.push(billObj);
    typesArr.push(object1);
    component.types = typesArr;
    component.billList = billArr;
    const smpChanges: SimpleChanges = {};
    component.ngOnChanges(smpChanges);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
