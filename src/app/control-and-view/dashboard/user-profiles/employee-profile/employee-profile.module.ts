import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeDashbordModule } from '../../user-dashboards/employee-dashboard/employee-dashbord.module';
import{ EmployeeProfileComponent }   from './employee-profile.component';
import { FileUploadModule } from 'ng2-file-upload';
const routes: Routes = [
  {
    path: '',
    component: EmployeeProfileComponent
  }
  
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    FormsModule, 
    ReactiveFormsModule,
    EmployeeDashbordModule,
    RouterModule.forChild(routes),
    FileUploadModule
  ],
  declarations: [EmployeeProfileComponent]
})
export class EmployeeProfileModule { }
