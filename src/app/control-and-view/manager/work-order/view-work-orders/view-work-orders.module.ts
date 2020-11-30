import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';
import { CalendarModule } from 'primeng/calendar';
import { NgDatepickerModule} from 'ng2-datepicker';
import { ViewWorkOrdersComponent } from './view-work-orders.component';
import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';
import { AgmCoreModule } from '@agm/core';

const routes: Routes = [
  {
    path: '',
    component: ViewWorkOrdersComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    ManagerDashBoardModule,
    FormsModule,
    CalendarModule,
    ReactiveFormsModule,
    NgDatepickerModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyDaciakO8dZrELxT9XoQvab6MYmhBSC4i0'       old gm api key
      apiKey: 'AIzaSyBL6NLlMU2vrJk4CRlI0FQa4BEQE_SiQrg'
      /* apiKey is required, unless you are a 
      premium customer, in which case you can 
      use clientId 
      */
    })
  ],
  declarations: [ViewWorkOrdersComponent]
})
export class ViewWorkOrdersModule { }
