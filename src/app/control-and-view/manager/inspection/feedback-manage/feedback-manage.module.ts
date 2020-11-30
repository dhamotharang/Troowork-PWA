import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule } from 'ng2-datepicker';
import { CalendarModule } from 'primeng/calendar';

import { FeedbackManageComponent } from './feedback-manage.component';


const routes: Routes = [
  {
    path: '',
    component: FeedbackManageComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    NgDatepickerModule,
    FormsModule, ReactiveFormsModule,
    CalendarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeedbackManageComponent]
})
export class FeedbackManageModule { }
