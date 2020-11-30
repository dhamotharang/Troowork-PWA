import { DataService } from "./data.service";
import { ReactiveFormsModule, } from "@angular/forms";
import { CommonModule, } from "@angular/common";
// import {BrowserModule} from "@angular/platform-browser";
import { NgModule, } from "@angular/core";
import { ViewEmployeeSchedulerComponent } from "./view-employee-scheduler.component";
import { DayPilotModule } from "daypilot-pro-angular";

import { HttpClientModule } from "@angular/common/http";
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgDatepickerModule } from 'ng2-datepicker';

const routes: Routes = [
  {
    path: '',
    component: ViewEmployeeSchedulerComponent
  }
];

@NgModule({
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgDatepickerModule,
    DayPilotModule,
    RouterModule.forChild(routes)],
  declarations: [
    ViewEmployeeSchedulerComponent
  ],
  exports: [ViewEmployeeSchedulerComponent],
  providers: [DataService]
})
export class ViewEmployeeSchedulerModule { }
