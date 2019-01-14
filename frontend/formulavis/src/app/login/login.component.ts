import {Component} from '@angular/core';
import {Router} from '@angular/router';


import {AuthService} from "../_services/auth.service";
import {AlertService} from "../_services/alert.service";

import {User} from '../_models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: User = new User;

  captchaValid: boolean = false;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router) {
  }

  login() {
    if (!this.captchaValid) {
      return;
    }
    this.authService.tokenAuth(this.user).subscribe(
      data => this.router.navigate(['sat']),
      error => this.alertService.error(error)
    )
  }

  captchaResolved(captchaResponse: string) {
    this.captchaValid = !!captchaResponse;
  }
}
