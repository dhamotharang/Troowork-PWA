import {DataService} from "./data.service";
import {ReactiveFormsModule,} from "@angular/forms";
import {CommonModule,} from "@angular/common";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgModule,} from "@angular/core";
import {SchedulerComponent} from "./scheduler.component";
import {DayPilotModule} from "daypilot-pro-angular";
import {CreateComponent} from "./create.component";
import {EditComponent} from "./edit.component";
import {HttpClientModule} from "@angular/common/http";
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgDatepickerModule} from 'ng2-datepicker';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
const routes: Routes = [
  {
    path: '',
    component: SchedulerComponent
  }
];

@NgModule({
  imports:      [ CommonModule,FormsModule, ReactiveFormsModule, HttpClientModule,NgDatepickerModule,MDBBootstrapModule, DayPilotModule, NgMultiSelectDropDownModule.forRoot(),RouterModule.forChild(routes) ],
  declarations: [
    SchedulerComponent,
    CreateComponent,
    EditComponent
  ],
  exports:      [ SchedulerComponent, CreateComponent,
                  EditComponent ],
  providers:    [ DataService ]
})
export class SchedulerModule { }
