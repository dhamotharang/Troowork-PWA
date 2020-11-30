import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule} from 'ng2-datepicker';


import { ViewEmployeeWeeklyScheduleDetailComponent } from './view-employee-weekly-schedule-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ViewEmployeeWeeklyScheduleDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    NgDatepickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewEmployeeWeeklyScheduleDetailComponent]
})
export class ViewEmployeeWeeklyScheduleDetailModule { }
