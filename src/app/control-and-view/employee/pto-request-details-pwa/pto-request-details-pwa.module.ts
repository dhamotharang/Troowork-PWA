import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule} from 'ng2-datepicker';
import { EmployeeDashbordModule } from '../../dashboard/user-dashboards/employee-dashboard/employee-dashbord.module';
import { PtoRequestDetailsPWAComponent } from "./pto-request-details-pwa.component";
import { CalendarModule } from 'primeng/calendar';
const routes: Routes = [
  {
    path: '',
    component: PtoRequestDetailsPWAComponent
  }
  
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    EmployeeDashbordModule,
    NgDatepickerModule,
    FormsModule, ReactiveFormsModule,
    CalendarModule,
    RouterModule.forChild(routes)
  
  ],
  declarations: [PtoRequestDetailsPWAComponent]
})
export class PtoRequestDetailsPWAModule { }
