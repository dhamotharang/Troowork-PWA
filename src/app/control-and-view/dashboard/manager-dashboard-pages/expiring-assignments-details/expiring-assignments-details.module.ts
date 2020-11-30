import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule } from 'ng2-datepicker';
import { ExpiringAssignmentsDetailsComponent } from "./expiring-assignments-details.component";
import { MDBBootstrapModule } from 'angular-bootstrap-md';

const routes: Routes = [
  {
    path: '',
    component: ExpiringAssignmentsDetailsComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgDatepickerModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    MDBBootstrapModule.forRoot()
  ],
  declarations: [ExpiringAssignmentsDetailsComponent]
})
export class ExpiringAssignmentsDetailsModule { }
