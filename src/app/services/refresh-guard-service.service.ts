import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from '../modules/dashboard/services/general.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshGuardServiceService implements CanActivate {

  constructor(private _router: Router, private generalService: GeneralService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this._router.navigated && !this.generalService.isForcePassword) {
      this._router.navigate(['/']);
      return false;
    }
    return true;
  }
}
