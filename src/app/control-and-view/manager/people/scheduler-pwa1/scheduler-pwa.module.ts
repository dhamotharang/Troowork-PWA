import {DataPWAService} from "./data-pwa.service";
import {ReactiveFormsModule,} from "@angular/forms";
import {CommonModule,} from "@angular/common";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgModule,} from "@angular/core";
import {SchedulerPWAComponent} from "./scheduler-pwa.component";
import {DayPilotModule} from "daypilot-pro-angular";
import {CreatePWAComponent} from "./create-pwa.component";
import {EditPWAComponent} from "./edit-pwa.component";
import {HttpClientModule} from "@angular/common/http";
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgDatepickerModule} from 'ng2-datepicker';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

const routes: Routes = [
  {
    path: '',
    component: SchedulerPWAComponent
  }
];

@NgModule({
  imports:      [ CommonModule,FormsModule, ReactiveFormsModule, HttpClientModule,NgDatepickerModule,MDBBootstrapModule, DayPilotModule, NgMultiSelectDropDownModule.forRoot(),RouterModule.forChild(routes) ],
  declarations: [
    SchedulerPWAComponent,
    CreatePWAComponent,
    EditPWAComponent,

  ],
  exports:      [ SchedulerPWAComponent, CreatePWAComponent,
                  EditPWAComponent ],
  providers:    [ DataPWAService ]
})
export class SchedulerPWAModule { }
