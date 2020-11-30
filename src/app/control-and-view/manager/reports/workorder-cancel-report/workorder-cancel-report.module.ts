import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';
import { NgDatepickerModule } from 'ng2-datepicker';

import { WorkorderCancelReportComponent } from './workorder-cancel-report.component';

const routes: Routes = [
  {
    path: '',
    component: WorkorderCancelReportComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    FormsModule, ReactiveFormsModule,
    NgDatepickerModule,
    IgxDatePickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WorkorderCancelReportComponent]
})
export class WorkorderCancelReportModule { }
