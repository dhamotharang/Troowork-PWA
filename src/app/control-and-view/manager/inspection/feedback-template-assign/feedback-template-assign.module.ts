import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FeedbackTemplateAssignComponent } from './feedback-template-assign.component';


const routes: Routes = [
  {
    path: '',
    component: FeedbackTemplateAssignComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeedbackTemplateAssignComponent]
})
export class FeedbackTemplateAssignModule { }
