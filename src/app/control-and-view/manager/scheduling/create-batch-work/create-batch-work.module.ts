import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';


import { CreateBatchWorkComponent } from './create-batch-work.component';
// import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';

const routes: Routes = [
  {
    path: '',
    component: CreateBatchWorkComponent
  }
  
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    CalendarModule,
    FormsModule, ReactiveFormsModule,
   
    RouterModule.forChild(routes)
  ],
  declarations: [CreateBatchWorkComponent]
})
export class CreateBatchWorkModule { }
