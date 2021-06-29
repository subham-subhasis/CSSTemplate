import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeAmountComponent } from './dispute-amount.component';
import { AppUtils } from 'src/app/utils/app.util';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('DisputeAmountComponent', () => {
  let component: DisputeAmountComponent;
  let fixture: ComponentFixture<DisputeAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisputeAmountComponent ],
      imports: [NgxSpinnerModule, TranslateModule.forRoot(), HttpClientModule,
      ToastrModule.forRoot()],
      providers: [AppUtils]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputeAmountComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
