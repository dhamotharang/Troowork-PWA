import { DataPWAService } from "./data-pwa.service";
import { ReactiveFormsModule, } from "@angular/forms";
import { CommonModule, } from "@angular/common";
// import {BrowserModule} from "@angular/platform-browser";
import { NgModule, } from "@angular/core";
import { ViewEmployeeSchedulerPWAComponent } from "./view-employee-scheduler-pwa.component";
import { DayPilotModule } from "daypilot-pro-angular";

import { HttpClientModule } from "@angular/common/http";
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgDatepickerModule } from 'ng2-datepicker';
const routes: Routes = [
  {
    path: '',
    component: ViewEmployeeSchedulerPWAComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MDBBootstrapModule ,
    NgDatepickerModule,
    DayPilotModule,
    RouterModule.forChild(routes)],
  declarations: [
    ViewEmployeeSchedulerPWAComponent
  ],
  exports: [ViewEmployeeSchedulerPWAComponent],
  providers: [DataPWAService]
})
export class ViewEmployeeSchedulerPWAModule { }
