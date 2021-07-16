import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';
import { NgDatepickerModule} from 'ng2-datepicker';

import { WorkorderAverageReportComponent } from './workorder-average-report.component';
import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';




const routes: Routes = [
  {
    path: '',
    component: WorkorderAverageReportComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    ManagerDashBoardModule,
    FormsModule, ReactiveFormsModule,
    NgDatepickerModule,
    IgxDatePickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WorkorderAverageReportComponent]
})
export class WorkorderAverageReportModule { }
