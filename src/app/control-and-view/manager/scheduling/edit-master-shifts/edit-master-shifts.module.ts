import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EditMasterShiftsComponent } from './edit-master-shifts.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: EditMasterShiftsComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MDBBootstrapModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditMasterShiftsComponent]
})
export class EditMasterShiftsModule { }
