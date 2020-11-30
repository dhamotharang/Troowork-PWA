import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { CalendarModule } from 'primeng/calendar';
import { NgDatepickerModule} from 'ng2-datepicker';

import { ManagerinspectiontemplateComponent } from './managerinspectiontemplate.component';
import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';

const routes: Routes = [
  {
    path: '',
    component: ManagerinspectiontemplateComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    ManagerDashBoardModule,
    NgDatepickerModule,
    FormsModule, ReactiveFormsModule,
    CalendarModule,
    RouterModule.forChild(routes),
    FileUploadModule
  ],
  declarations: [ManagerinspectiontemplateComponent]
})
export class ManagerinspectiontemplateModule { }
