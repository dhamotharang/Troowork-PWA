import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeDashbordModule } from '../../dashboard/user-dashboards/employee-dashboard/employee-dashbord.module';
import { PtoRequestPWAComponent } from "../pto-request-pwa/pto-request-pwa.component";
import { NgDatepickerModule} from 'ng2-datepicker';
import { CalendarModule } from 'primeng/calendar';

const routes: Routes = [
  {
    path: '',
    component: PtoRequestPWAComponent
  }
  
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    EmployeeDashbordModule,
    NgDatepickerModule,CalendarModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PtoRequestPWAComponent]
})
export class PtoRequestPWAModule { }
