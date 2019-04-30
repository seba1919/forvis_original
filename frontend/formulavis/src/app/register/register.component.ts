import {Component} from '@angular/core';
import {Router} from '@angular/router';


import {RegisterService} from "../_services/register.service";
import {AlertService} from "../_services/alert.service";

import {User} from '../_models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = new User;
  captchaValid: boolean = false;
  captchaResponse: string = undefined;

  constructor(
    private regsterService: RegisterService,
    private alertService: AlertService,
    private router: Router) {
  }

  register() {
    if (!this.captchaValid) {
      return;
    }
    this.regsterService.register(this.user, this.captchaResponse).subscribe(
        data => this.router.navigate(['login']),
        error => this.alertService.error(error)
    )
  }

  captchaResolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
}
