import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDisputeComponent } from './create-dispute.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleChartsModule } from 'angular-google-charts';
import { AppUtils } from 'src/app/utils/app.util';
import { DisputeFormComponent } from './dispute-form/dispute-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('CreateDisputeComponent', () => {
  let component: CreateDisputeComponent;
  let fixture: ComponentFixture<CreateDisputeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDisputeComponent, DisputeFormComponent ],
      imports: [RouterTestingModule, GoogleChartsModule.forRoot(), ReactiveFormsModule],
      providers: [AppUtils]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDisputeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
