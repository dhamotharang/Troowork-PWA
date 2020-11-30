import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupervisorWelcomeComponent } from './supervisor-welcome.component';
import { Routes, RouterModule } from '@angular/router';
import { NgMarqueeModule } from 'ng-marquee';
import { HttpClientModule } from '@angular/common/http';

import{ SupervisorDashboardModule  } from '../../user-dashboards/supervisor-dashboard/supervisor-dashboard.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: SupervisorWelcomeComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    SupervisorDashboardModule,
    HttpClientModule,
    MDBBootstrapModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgMarqueeModule
  ],
  declarations: [SupervisorWelcomeComponent]
})
export class SupervisorWelcomeModule { }
