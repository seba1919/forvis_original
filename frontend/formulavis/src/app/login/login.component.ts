import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AuthService } from "../_services/auth.service";
import { AlertService } from "../_services/alert.service";

import { User } from '../_models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = new User;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router,
  ){}

  ngOnInit() {
  }

  login(){
    this.authService.tokenAuth(this.user).subscribe(
      data => this.router.navigate(['sat']),
      error => this.alertService.error(error)
    )
  }
}
