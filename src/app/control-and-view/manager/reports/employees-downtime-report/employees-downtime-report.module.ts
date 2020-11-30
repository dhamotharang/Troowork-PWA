import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';
import { NgDatepickerModule } from 'ng2-datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EmployeesDowntimeReportComponent } from './employees-downtime-report.component';
import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';
// import { ChartsModule } from 'ng2-charts';
const routes: Routes = [
  {
    path: '',
    component: EmployeesDowntimeReportComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    ManagerDashBoardModule,
    FormsModule, ReactiveFormsModule,
    IgxDatePickerModule,
    NgDatepickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild(routes),
    // ChartsModule
  ],
  declarations: [EmployeesDowntimeReportComponent]
})
export class EmployeesDowntimeReportModule { }
