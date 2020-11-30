import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { CreateshiftComponent } from './createshift.component';
// import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';


const routes: Routes = [
  {
    path: '',
    component: CreateshiftComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule,
    // ManagerDashBoardModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule,
    CalendarModule
  ],
  declarations: [CreateshiftComponent]
})
export class CreateshiftModule { }
