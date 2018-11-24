import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FileUploadModule } from 'ng2-file-upload'
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { AlertComponent } from './alert/alert.component';
import { SatComponent } from './sat/sat.component';

import { AuthService } from "./_services/auth.service";
import { AlertService } from "./_services/alert.service";
import { FileService} from "./_services/file.service";
import { VisMenuService} from "./_services/vis-menu.service";

import { AuthGuard } from "./_guards/auth.guard";
import { VisMenuComponent } from './vis-menu/vis-menu.component';
import { VisualizationRawComponent } from './visualization-raw/visualization-raw.component';
import { VisualizationVisFactorComponent } from "./visualization-vis_factor/visualization-vis_factor.component";
import { VisualizationVisInteractionComponent } from "./visualization-vis_interaction/visualization-vis_interaction.component";
import { VisualizationVisResolutionComponent } from "./visualization-vis_resolution/visualization-vis_resolution.component";
import { MaxsatComponent } from './maxsat/maxsat.component';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'visualization-vis_resolution', component: VisualizationVisResolutionComponent, canActivate:[AuthGuard] },
  { path: 'visualization-vis_factor', component: VisualizationVisFactorComponent, canActivate:[AuthGuard] },
  { path: 'visualization-vis_interaction', component: VisualizationVisInteractionComponent, canActivate:[AuthGuard] },
  { path: 'visualization-raw', component: VisualizationRawComponent, canActivate:[AuthGuard] },
  { path: 'sat', component: SatComponent, canActivate:[AuthGuard] },
  { path: 'maxsat', component: MaxsatComponent, canActivate:[AuthGuard] },

  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    AlertComponent,
    SatComponent,
    VisualizationVisResolutionComponent,
    VisualizationVisFactorComponent,
    VisualizationVisInteractionComponent,
    VisualizationRawComponent,
    VisMenuComponent,
    MaxsatComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    HttpModule,
    FileUploadModule
  ],
  providers: [
    AuthGuard,

    AlertService,
    AuthService,
    FileService,
    VisMenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
