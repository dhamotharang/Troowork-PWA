import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule} from 'ng2-datepicker';


import { AddEmployeeComponent } from './add-employee.component';


const routes: Routes = [
  {
    path: '',
    component: AddEmployeeComponent
  }
  
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    
    FormsModule,
    ReactiveFormsModule,
    NgDatepickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddEmployeeComponent]
})
export class AddEmployeeModule { }
