import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';
import { CalendarModule } from 'primeng/calendar';

import { ManagerMyprofileComponent } from './manager-myprofile.component';
import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';
import { FileUploadModule } from 'ng2-file-upload';
const routes: Routes = [
  {
    path: '',
    component: ManagerMyprofileComponent
  }
  
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    ManagerDashBoardModule,
    FormsModule,
    CalendarModule,
    ReactiveFormsModule,
    IgxDatePickerModule,
    RouterModule.forChild(routes),
    FileUploadModule
  ],
  declarations: [ManagerMyprofileComponent]
})
export class ManagerMyprofileComponentModule { }
