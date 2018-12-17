import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Network, DataSet, Node, Edge, IdType } from 'vis';

import { FileService } from "../_services/file.service";
import { AlertService } from "../_services/alert.service";

import { File } from "../_models/file";

@Component({
  selector: 'app-visualization-vis_factor',
  templateUrl: './visualization-vis_factor.component.html',
  styleUrls: ['./visualization-vis_factor.component.css']
})
export class VisualizationVisFactorComponent implements OnInit {
  fileId: number;
  fileName: string;
  file: File = new File();
  info: string;
  kind: string;

  loading: boolean;
  stabilizationInProgress: boolean;

  public nodes: Node;
  public edges: Edge;
  public network : Network;


  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
         this.fileId = params['f'];
         this.fileName = params['name'];
         this.kind = params['kind'];
         this.loadVis();
    });
  }

  startStab(){
    this.network.startSimulation();
  }

  stopStab(){
    this.network.stopSimulation();
    this.network.fit();
  }

  loadVis() {
    var getFile
    if (this.kind == 'sat'){
      getFile = this.fileService.getSatFile(this.fileId, 'sat_vis_factor')
    }
    else{
      getFile = this.fileService.getMaxSatFile(this.fileId, 'maxsat_vis_factor')
    }
    getFile.subscribe(
       data => {
         if(data['content']['data']['message']){
           this.info = data['content']['data']['message'];

           setTimeout(() => {
             this.loadVis();
             },
             1000
           );

         }else{
           this.info = null;

           this.file = data;

           this.nodes = new DataSet(data['content']['data']['nodes']);
           this.edges = new DataSet(data['content']['data']['edges']);
           this.nodes.forEach(node => {
             if (node.font && node.font.size < 1) {
               node.font.size = 1;
             }
           });

           let container = document.getElementById('visualization');
           let _data = {
              nodes: this.nodes,
              edges: this.edges
           };
           let options = {
             "edges": {
                "smooth": false
             },
             "physics": {
               "enabled": true,
               "barnesHut": {
                  "avoidOverlap": 1,
                  "centralGravity": 3.5
                },
               "maxVelocity": 1,
               "minVelocity": 1
             }
           };

           this.loading = true;
           this.network = new Network(container, _data, options);
           this.stopStab();

           this.network.on("startStabilizing", function (params) {
                this.stabilizationInProgress = true;
           }.bind(this));

           this.network.on("stabilized", function (params) {
                this.stabilizationInProgress = false;
           }.bind(this));

           this.network.once("stabilizationIterationsDone", function() {
                this.loading = false;
                this.stabilizationInProgress = false;
           }.bind(this));
         }
       },
       error => this.alertService.error(error)
    )
  }
}
