import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Subject } from 'rxjs/Subject';

import { File } from "../_models/file";


@Injectable()
export class VisMenuService {
  private overlayMenu = new Subject<any>();

  constructor(){}

  getOverlayStatus(): Observable<any> {
        return this.overlayMenu.asObservable();
  }

  open(file: File, kind: string){
    this.overlayMenu.next({show: true, file: file, kind: kind});
  }

  close(){
    this.overlayMenu.next({show: false});
  }
}
