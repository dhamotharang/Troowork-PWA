import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { AngularMultiSelectModule } from '../../../../extra-files/MultiSelect2/multiselect.component';
import { NgDatepickerModule } from 'ng2-datepicker';
import { BrowserModule } from '@angular/platform-browser'
import { DashboardReportComponent } from './dashboard-report.component';
import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';
import { DataService } from './data.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardReportComponent
  }

];


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // BrowserModule,
    MDBBootstrapModule,
    ManagerDashBoardModule,
    FormsModule, ReactiveFormsModule,
    NgDatepickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    // AngularMultiSelectModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashboardReportComponent],
  providers: [DataService]
})
export class DashboardReportModule { }
