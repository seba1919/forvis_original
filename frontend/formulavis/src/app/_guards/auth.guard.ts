import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

import { AuthService } from "../_services/auth.service";


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.authService.tokenVerify().map(e => {
            if (e) return true;
        }).catch(() => {
            this.router.navigate(['login'],{queryParams: {returnUrl: state.url}});
            return Observable.of(false);
        });
  }
}
