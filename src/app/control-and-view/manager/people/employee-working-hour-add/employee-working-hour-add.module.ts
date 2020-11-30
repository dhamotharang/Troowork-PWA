import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';
import { NgDatepickerModule} from 'ng2-datepicker';
import { CalendarModule } from 'primeng/calendar';
import { EmployeeWorkingHourAddComponent } from './employee-working-hour-add.component';


const routes: Routes = [
  {
    path: '',
    component: EmployeeWorkingHourAddComponent
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
    CalendarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmployeeWorkingHourAddComponent]
})
export class EmployeeWorkingHourAddModule { }
