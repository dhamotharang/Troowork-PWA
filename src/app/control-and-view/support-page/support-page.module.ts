import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule } from 'ng2-datepicker';
import { SupportPageComponent } from "./support-page.component";
import { MDBBootstrapModule } from 'angular-bootstrap-md';
const routes: Routes = [
  {
    path: '',
    component: SupportPageComponent
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
  declarations: [SupportPageComponent]
})
export class SupportPageModule { }
