import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';


import { ViewEmployeeWeeklyScheduleComponent } from './view-employee-weekly-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: ViewEmployeeWeeklyScheduleComponent
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
  declarations: [ViewEmployeeWeeklyScheduleComponent]
})
export class ViewEmployeeWeeklyScheduleModule { }
