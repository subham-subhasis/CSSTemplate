import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeCreateComponent } from './dispute-create.component';

describe('DisputeCreateComponent', () => {
  let component: DisputeCreateComponent;
  let fixture: ComponentFixture<DisputeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisputeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisputeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
