import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

import { AuthService } from "../_services/auth.service";
import { FileService } from "../_services/file.service";
import { AlertService } from "../_services/alert.service";
import { VisMenuService } from "../_services/vis-menu.service";

import { File } from "../_models/file";

@Component({
  selector: 'app-maxsat',
  templateUrl: './maxsat.component.html',
  styleUrls: ['./maxsat.component.css']
})
export class MaxsatComponent implements OnInit {
  public uploader:FileUploader = new FileUploader({});

  files: Array<File> = [];

   constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private fileService: FileService,
    private visMenuService: VisMenuService
  ) { }

  ngOnInit() {
    this.updateList();

    this.uploader.authToken = this.authService.getAuthTokenString();
    this.uploader.onBeforeUploadItem = (item) => {
      item.method = 'PUT';
      item.url = '/api/profile/upload/maxsat/' + item.file.name + '/';
    };

    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      this.updateList();

      setTimeout(() => {
         this.updateList();
         },
         8000
     );
    };
  }

  updateList(){
    this.fileService.getMaxSatFilesList().subscribe(
      data => this.files = data,
      error => this.alertService.error(error)
    )
  }

  deleteFile(file: File){
    this.fileService.deleteSatFile(file.id).subscribe(
      data => this.updateList(),
      error => this.alertService.error(error)
    )
  }

  openVisMenu(file: File){
    this.visMenuService.open(file, 'maxsat');
  }

}
