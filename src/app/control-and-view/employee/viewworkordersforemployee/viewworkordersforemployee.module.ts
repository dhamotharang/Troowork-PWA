import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeDashbordModule } from '../../dashboard/user-dashboards/employee-dashboard/employee-dashbord.module';
import{ ViewworkordersforemployeeComponent }   from './viewworkordersforemployee.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgDatepickerModule} from 'ng2-datepicker';
const routes: Routes = [
  {
    path: '',
    component: ViewworkordersforemployeeComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    EmployeeDashbordModule,
    // UserDashboardsModule,
    // InventoryModule,
    NgDatepickerModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    FileUploadModule
  ],
  declarations: [ViewworkordersforemployeeComponent]
})
export class ViewworkordersforemployeeModule { }
