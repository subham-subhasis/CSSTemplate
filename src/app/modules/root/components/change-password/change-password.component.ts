import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AppUtils } from 'src/app/utils/app.util';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  txtInputVal = '';
  minLength: Observable<number>;
  isdataAvailable = false;
  isWarningMsg = false;

  constructor(private generalService: GeneralService,
    private settingService: SettingsService, private router: Router, private toastrSrvice: ToastrService, private spinnerService: NgxSpinnerService, private appUtils: AppUtils) { }

  ngOnInit() {
    this.isWarningMsg = this.generalService.isForcePassword;
    this.initializeForm();
    this.spinnerService.hide('appSpinner');
    this.generalService.getPasswordDetails().subscribe(
      (data: any) => {
        this.isdataAvailable = true;
        this.minLength = data['minPasswordLength'];
      },
      err => {
      }
    );
  }

  initializeForm() {
    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl(null, [Validators.required]),
      // Validators.minLength(3)
      newPassword: new FormControl(null, [Validators.required, this.validateMinLength.bind(this)]),
      confirmPassword: new FormControl(null, [Validators.required])
    });
  }
  cancelForm() {
    if (!this.generalService.isForcePassword) {
      this.router.navigate(['/']);
    } else {
      const url = this.redirect('logout');
      location.assign(url);
    }
  }

  private redirect(param: string) {
    let url = '';
    if (!environment.production) {
      param === 'switch' ? url = 'http://10.113.116.113:8080/partnerportalv3/sparkLogin.jsp' :
        url = 'http://10.113.116.113:8080/partnerportalv3/sparkLogout.html';
    } else {
      const href: string = location.href;
      const protocol = this.settingService.applicationProperties['protocol'];
      const path = this.appUtils.generateDynamicUrl(href);
      if (param === 'switch') {
        const host = location.host;
        url = `${protocol}://${host}/${path}`;
      } else if (param === 'logout') {
        const host = location.host;
        url = `${protocol}://${host}/${path}/sparkLogout.html`;
      }
    }
    return url;
  }

  validateMinLength(formControl: FormControl) {
    if (this.isdataAvailable) {
      if (formControl.value.length < this.minLength) {
        return { 'invalidLength': true };
      }
      return null;
    }
  }

  saveData() {
    setTimeout(() => {
      this.spinnerService.show('changePasswordSpinner');
    });
    const curPwd = this.changePasswordForm.get('currentPassword').value;
    const confirmPwd = this.changePasswordForm.get('confirmPassword').value;
    const newPwd = this.changePasswordForm.get('newPassword').value;
    this.generalService.saveChangedPassword(curPwd, newPwd, confirmPwd)
      .subscribe(
        data => {
          if (data['responseMessage'] && data['responseMessage'] === 'Ok') {
            this.spinnerService.hide('changePasswordSpinner');
            this.toastrSrvice.success('Password Successfully saved');
            this.generalService.dashboardData.next(true);
            this.router.navigate(['/Dashboard']);
          }
        },
        error => {
          this.spinnerService.hide('changePasswordSpinner');
          console.log('***********1', error);
          console.log('***********2', error.error);
          console.log('***********3', error.error.responseMessage);
          if (error.error.responseMessage === 'current-password-mismatch') {
            this.toastrSrvice.error('current password not correct ');
          } else if (error.error.responseMessage === 'password-used') {
            this.toastrSrvice.error('password already used before');
          }
        }
      );
  }

}
