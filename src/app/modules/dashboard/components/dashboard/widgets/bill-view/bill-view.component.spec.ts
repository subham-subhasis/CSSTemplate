import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillViewComponent } from './bill-view.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { AppUtils } from 'src/app/utils/app.util';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

describe('BillViewComponent', () => {
  let component: BillViewComponent;
  let fixture: ComponentFixture<BillViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillViewComponent ],
      imports: [GoogleChartsModule.forRoot(), NgxSpinnerModule, HttpClientModule,
      ToastrModule.forRoot(), TranslateModule.forRoot()],
      providers: [AppUtils]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
