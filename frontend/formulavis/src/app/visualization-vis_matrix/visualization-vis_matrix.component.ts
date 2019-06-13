import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FileService } from "../_services/file.service";
import { AlertService } from "../_services/alert.service";

import { File } from "../_models/file";

class FormulaDependency {
    public positive: number = 0;
    public negative: number = 0;
}

class DependencyRow {
    public dependencies: FormulaDependency[];
}

class DependencyMatrix {
    public labels: string[];
    public rows: DependencyRow[];
}

@Component({
  selector: 'app-visualization-vis_matrix.component',
  templateUrl: './visualization-vis_matrix.component.html',
  styleUrls: ['./visualization-vis_matrix.component.css']
})
export class VisualizationVisMatrixComponent implements OnInit {

    readonly redCellStyle = {'background-color': 'hsl(0, 65%, 62%)'};
    readonly greenCellStyle = {'background-color': 'hsl(101, 65%, 62%)'};
    readonly yellowCellStyle = {'background-color': 'hsl(54, 65%, 62%)'};


  fileId: number;
  fileName: string;
  info: string;
  kind: string;

  loading: boolean = true;
  colorsOn: boolean = false;

  selectedMode: number = 0;

  public matrix: DependencyMatrix;


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

  private getCellStyle0(dependency: FormulaDependency)
  {
      if(dependency.positive + dependency.negative != 0)
        return this.yellowCellStyle;
  }

  private getCellStyle1(dependency: FormulaDependency)
  {
        if(dependency.positive > 0)
        {
            if(dependency.negative > 0)
            {
                return this.yellowCellStyle;
            }
            else
            {
                return this.greenCellStyle;
            }
        }
        if(dependency.negative > 0)
        {
            return  this.redCellStyle;
        }
        return {};
  }

  private getCellStyle2(dependency: FormulaDependency)
  {
    if(dependency.negative == dependency.positive)
    {
      return dependency.negative == 0 ? {} : this.yellowCellStyle;
    }
    else if(dependency.negative < dependency.positive)
    {
      return  this.greenCellStyle;
    }
    else
    {
      return this.redCellStyle;
    }
  }

  getCellStyle(dependency: FormulaDependency, rowIndx: number, colIndx: number)
  {
      
      if(rowIndx == colIndx)
      {
        return {'background-color': "#000000"};
      }

      if(!this.colorsOn)
        return {};

      if(this.selectedMode == 0)
        return this.getCellStyle0(dependency);
    
      if(this.selectedMode == 1)
        return this.getCellStyle1(dependency);

      if(this.selectedMode == 2)
        return this.getCellStyle2(dependency);
  }


  getCellContent(dependency: FormulaDependency)
  {
      if(this.selectedMode == 0)
      {
          return dependency.positive + dependency.negative != 0 ? "x" : " ";
      }
      if(this.selectedMode == 1)
      {
          let out = dependency.positive > 0 ? "+" : "";
          if(dependency.negative > 0)
            out += dependency.positive > 0 ? "/-" : "-";
          return out;
      }
      else
      {
        return dependency.positive + "/" + dependency.negative;
      }
  }

  selectMode(nr: number)
  {
      this.selectedMode = nr;
  }

  getColorButtonText()
  {
    if(this.colorsOn)
        return "Disable colors";
    else
        return "Enable colors";
  }

  switchColors()
  {
    this.colorsOn = !this.colorsOn;
  }


  loadVis() {
    var getFile
    if (this.kind == 'sat'){
      getFile = this.fileService.getSatFile(this.fileId, 'sat_vis_matrix')
    }
    else{
      getFile = this.fileService.getMaxSatFile(this.fileId, 'maxsat_vis_matrix')
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

           this.matrix = new DependencyMatrix();
           this.matrix.labels = data['content']['data']['labels'];
           this.matrix.rows = data['content']['data']['rows'];

           this.loading = false;
         }
       },
       error => this.alertService.error(error)
    )
  }
}
