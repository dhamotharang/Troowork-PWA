import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule} from 'ng2-datepicker';
import { EmployeeDashbordModule } from '../../dashboard/user-dashboards/employee-dashboard/employee-dashbord.module';
import { TradeRequestApproveComponent } from "./trade-request-approve.component";


const routes: Routes = [
  {
    path: '',
    component: TradeRequestApproveComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    EmployeeDashbordModule,
    NgDatepickerModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TradeRequestApproveComponent]
})
export class TradeRequestApproveModule { }
