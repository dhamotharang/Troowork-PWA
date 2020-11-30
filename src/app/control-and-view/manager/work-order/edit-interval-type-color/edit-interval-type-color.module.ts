import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditIntervalTypeColorComponent } from './edit-interval-type-color.component';
import { ColorPickerModule } from 'ngx-color-picker';
const routes: Routes = [
  {
    path: '',
    component: EditIntervalTypeColorComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    ColorPickerModule
  ],
  declarations: [EditIntervalTypeColorComponent]
})
export class EditIntervalTypeColorModule { }
