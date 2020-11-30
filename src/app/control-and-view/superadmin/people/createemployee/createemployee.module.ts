import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserModule } from '@angular/platform-browser'
import { NgDatepickerModule} from 'ng2-datepicker';
import { CreateemployeeComponent } from './createemployee.component';
import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';

const routes: Routes = [
  {
    path: '',
    component: CreateemployeeComponent
  }
  
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgDatepickerModule,
    MDBBootstrapModule,
    ManagerDashBoardModule,
    FormsModule, ReactiveFormsModule,
    IgxDatePickerModule,
    
    RouterModule.forChild(routes)
  ],
  declarations: [CreateemployeeComponent]
})
export class CreateemployeeModule { }
