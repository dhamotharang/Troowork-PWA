import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { CreateMasterShiftsComponent } from './create-master-shifts.component';
// import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';


const routes: Routes = [
  {
    path: '',
    component: CreateMasterShiftsComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule,
    CalendarModule
  ],
  declarations: [CreateMasterShiftsComponent]
})
export class CreateMasterShiftsModule { }
