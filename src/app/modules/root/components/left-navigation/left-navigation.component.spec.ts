import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftNavigationComponent } from './left-navigation.component';
import { RouterModule } from '@angular/router';

describe('LeftNavigationComponent', () => {
  let component: LeftNavigationComponent;
  let fixture: ComponentFixture<LeftNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftNavigationComponent ],
      imports:[RouterModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
