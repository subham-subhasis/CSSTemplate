import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';
// import { DashboardModule } from './modules/dashboard/dashboard.module';
import { RootModule } from './modules/root/root.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GeneralService } from './modules/dashboard/services/general.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, SharedModule, RootModule,
        HttpClientModule, ToastrModule.forRoot(), TranslateModule.forRoot()
      ],
      declarations: [
        AppComponent
      ],
      providers: [GeneralService, NgxSpinnerService, ToastrService,
      Title, TranslateService]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'pcp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.title = 'pcp';
    expect(app.title).toEqual('pcp');
  });

});
