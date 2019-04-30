import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';

import 'rxjs/add/operator/map'

import { User } from '../_models';

@Injectable()
export class RegisterService {
  register_url: string = '/api/profile/register/';

  constructor(
    private http: Http
  ){}

  register(user: User, captchaResponse: string){
      return this.http.post(this.register_url,
    {"username": user.name, "password": user.password, "recaptcha": captchaResponse})
    .map((response: Response) => response.ok);
  }
}
