import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { VisMenuService } from "../_services/vis-menu.service";

import { File } from "../_models/file";

@Component({
  selector: 'app-vis-menu',
  templateUrl: './vis-menu.component.html',
  styleUrls: ['./vis-menu.component.css']
})
export class VisMenuComponent implements OnInit {
  showMenu: Boolean;
  file: File;
  kind: string;

  constructor(
        private router: Router,
        private visMenuService: VisMenuService
  ) { }

  ngOnInit() {
    this.visMenuService.getOverlayStatus().subscribe(data => {
      this.showMenu = data.show;
      this.file = data.file;
      this.kind = data.kind;
    });
  }

  visualizeFile(where: string){
    this.router.navigate([where, {f: this.file.id, name: this.file.name, kind: this.kind}]);
    this.close();
  }

  close(){
    this.visMenuService.close();
  }

}
