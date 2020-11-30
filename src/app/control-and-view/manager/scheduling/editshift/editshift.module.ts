import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditshiftComponent } from './editshift.component';
// import { ManagerDashBoardModule } from '../../../dashboard/user-dashboards/manager-dash-board/manager-dash-board.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { CalendarModule } from 'primeng/calendar';

const routes: Routes = [
  {
    path: '',
    component: EditshiftComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    // ManagerDashBoardModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule,
    ColorPickerModule,
    CalendarModule
  ],
  declarations: [EditshiftComponent]
})
export class EditshiftModule { }
