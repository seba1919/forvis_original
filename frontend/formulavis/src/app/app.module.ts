import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {FileUploadModule} from 'ng2-file-upload';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {MenuComponent} from './menu/menu.component';
import {AlertComponent} from './alert/alert.component';
import {SatComponent} from './sat/sat.component';

import {AlertService, AuthService, FileService, VisMenuService, RegisterService} from './_services';

import {AuthGuard} from './_guards/auth.guard';
import {VisMenuComponent} from './vis-menu/vis-menu.component';
import {VisualizationRawComponent} from './visualization-raw/visualization-raw.component';
import {VisualizationVisFactorComponent} from './visualization-vis_factor/visualization-vis_factor.component';
import {VisualizationVisInteractionComponent} from './visualization-vis_interaction/visualization-vis_interaction.component';
import {VisualizationVisResolutionComponent} from './visualization-vis_resolution/visualization-vis_resolution.component';
import {VisualizationVisMatrixComponent} from './visualization-vis_matrix/visualization-vis_matrix.component';
import {VisualizationVisTreeComponent} from './visualization-vis_tree/visualization-vis_tree.component'
import {VisualizationVisClusterComponent} from './visualization-vis_cluster/visualization-vis_cluster.component';
import {MaxsatComponent} from './maxsat/maxsat.component';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {RecaptchaModule} from "ng-recaptcha";


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'visualization-vis_resolution', component: VisualizationVisResolutionComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_factor', component: VisualizationVisFactorComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_interaction', component: VisualizationVisInteractionComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_matrix', component: VisualizationVisMatrixComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_tree', component: VisualizationVisTreeComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_cluster', component: VisualizationVisClusterComponent, canActivate: [AuthGuard]},
  {path: 'visualization-raw', component: VisualizationRawComponent, canActivate: [AuthGuard]},
  {path: 'sat', component: SatComponent, canActivate: [AuthGuard]},
  {path: 'maxsat', component: MaxsatComponent, canActivate: [AuthGuard]},

  {path: '**', component: HomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    MenuComponent,
    AlertComponent,
    SatComponent,
    VisualizationVisResolutionComponent,
    VisualizationVisFactorComponent,
    VisualizationVisInteractionComponent,
    VisualizationVisMatrixComponent,
    VisualizationVisTreeComponent,
    VisualizationVisClusterComponent,
    VisualizationRawComponent,
    VisMenuComponent,
    MaxsatComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    HttpModule,
    FileUploadModule,
    SelectDropDownModule,
    RecaptchaModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    RegisterService,
    AuthService,
    FileService,
    VisMenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
