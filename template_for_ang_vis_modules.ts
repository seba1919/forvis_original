// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
//
// import { FileService } from "../_services/file.service";
//
// import { File } from "../_models/file";
// import { AlertService } from "../_services/alert.service";
//
// @Component({
//   selector: 'app-visualization-<<<WPISZTYP>>>',
//   templateUrl: './visualization-<<<WPISZTYP>>>.component.html',
//   styleUrls: ['./visualization-<<<WPISZTYP>>>.component.css']
// })
// export class Visualization<<<WPISZTYP>>>Component implements OnInit {
//   fileId: number;
//   file: File = new File();
//   info: string;
//
//   constructor(
//     private route: ActivatedRoute,
//     private fileService: FileService,
//     private alertService: AlertService
//   ) { }
//
//   ngOnInit() {
//     this.route.params.subscribe(
//       params => {
//          this.fileId = params['f'];
//          this.loadVis();
//     });
//   }
//
//   loadVis() {
//     this.fileService.getFile(this.fileId, '<<<WPISZTYP>>>').subscribe(
//       data => {
//         if (data['content']['data']['message']) {
//           this.info = data['content']['data']['message'];
//
//           setTimeout(() => {
//               this.loadVis();
//             },
//             1000
//           );
//         } else {
//           this.info = null;
//
//         }
//       });
//   };
// }
//
