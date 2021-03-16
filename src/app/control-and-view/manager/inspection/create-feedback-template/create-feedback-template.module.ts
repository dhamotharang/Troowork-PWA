import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateFeedbackTemplateComponent } from './create-feedback-template.component';
const routes: Routes = [
  {
    path: '',
    component: CreateFeedbackTemplateComponent
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
  declarations: [CreateFeedbackTemplateComponent]
})

export class CreateFeedbackTemplateModule { }
