import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule} from 'ng2-datepicker';
import { IgxDatePickerModule } from 'igniteui-angular';

import { EditAssignmentScheduleForReportComponent } from './edit-assignment-schedule-for-report.component';
import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';

const routes: Routes = [
  {
    path: '',
    component: EditAssignmentScheduleForReportComponent
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
    RouterModule.forChild(routes),
    CalendarModule
  ],
  declarations: [EditAssignmentScheduleForReportComponent]
})
export class EditAssignmentScheduleForReportModule { }
