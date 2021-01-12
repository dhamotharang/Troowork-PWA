import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule} from 'ng2-datepicker';
import { EmployeeDashbordModule } from '../../dashboard/user-dashboards/employee-dashboard/employee-dashbord.module';
import { TradeRequestDetailsPWAComponent } from "./trade-request-details-pwa.component";
 
const routes: Routes = [
  {
    path: '',
    component: TradeRequestDetailsPWAComponent
  }
  
];
@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    HttpClientModule,
    EmployeeDashbordModule,
    NgDatepickerModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TradeRequestDetailsPWAComponent]
})
export class TradeRequestDetailsPWAModule { }
