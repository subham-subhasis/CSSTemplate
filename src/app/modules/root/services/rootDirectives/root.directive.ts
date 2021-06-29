import { Directive, Input } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appRoot]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: RootDirective,
    multi: true
  }]
})
export class RootDirective implements Validator {
  validate(control: AbstractControl): import('@angular/forms').ValidationErrors {
    if (control.parent) {
      const pwdToCompare = (control.parent.get('newPassword'));
      if (pwdToCompare && pwdToCompare.value !== control.value) {
        return {'notEqual': true};
      }
    }
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
  }

  constructor() { }

}
