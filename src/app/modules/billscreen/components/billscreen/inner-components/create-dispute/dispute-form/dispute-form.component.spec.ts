import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeFormComponent } from './dispute-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('DisputeFormComponent', () => {
  let component: DisputeFormComponent;
  let fixture: ComponentFixture<DisputeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisputeFormComponent ],
       imports: [ReactiveFormsModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
