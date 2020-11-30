import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgDatepickerModule} from 'ng2-datepicker';
import { TradeRequestActionComponent } from "./trade-request-action.component";
import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';

const routes: Routes = [
  {
    path: '',
    component: TradeRequestActionComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    ManagerDashBoardModule,
    FormsModule,
    ReactiveFormsModule,
    NgDatepickerModule,
    CalendarModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [TradeRequestActionComponent]
})
export class TradeRequestActionModule { }
