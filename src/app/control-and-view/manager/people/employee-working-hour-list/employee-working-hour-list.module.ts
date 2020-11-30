import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';
import { NgDatepickerModule} from 'ng2-datepicker';

import { EmployeeWorkingHourListComponent } from './employee-working-hour-list.component';


const routes: Routes = [
  {
    path: '',
    component: EmployeeWorkingHourListComponent
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
    NgDatepickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmployeeWorkingHourListComponent]
})
export class EmployeeWorkingHourListModule { }
