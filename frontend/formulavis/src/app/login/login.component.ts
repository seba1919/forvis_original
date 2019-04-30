import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';


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
  captchaResponse: string = undefined;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  login() {
    if (!this.captchaValid) {
      return;
    }
    let returnUrl = 'sat';
    
    this.route.queryParams.subscribe(next => {
      if(next["returnUrl"])
        returnUrl = next["returnUrl"];
    });

    this.authService.tokenAuth(this.user, this.captchaResponse).subscribe(
      data => this.router.navigate([returnUrl]),
      error => this.alertService.error(error)
    );
  }

  goToRegistration() {
    this.router.navigate(['register']);
  }

  captchaResolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
}
