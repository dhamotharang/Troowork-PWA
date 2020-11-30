import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZoneCreateComponent } from './zone-create.component';
import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';



const routes: Routes = [
  {
    path: '',
    component: ZoneCreateComponent
  }
  
];


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    ManagerDashBoardModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ZoneCreateComponent]
})
export class ZoneCreateModule { }
