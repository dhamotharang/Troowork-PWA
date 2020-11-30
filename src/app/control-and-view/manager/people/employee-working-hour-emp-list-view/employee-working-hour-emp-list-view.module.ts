import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';


import { EmployeeWorkingHourEmpListViewComponent } from './employee-working-hour-emp-list-view.component';


const routes: Routes = [
  {
    path: '',
    component: EmployeeWorkingHourEmpListViewComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    IgxDatePickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmployeeWorkingHourEmpListViewComponent]
})
export class EmployeeWorkingHourEmpListViewModule { }
