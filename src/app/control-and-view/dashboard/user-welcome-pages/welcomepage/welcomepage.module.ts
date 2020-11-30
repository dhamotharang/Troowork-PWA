import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WelcomepageComponent } from './welcomepage.component';
import { NgMarqueeModule } from 'ng-marquee';
// import { ManagerDashBoardComponent } from '../../user-dashboards/manager-dash-board/manager-dash-board.component';
// import { ManagerDashBoardModule } from '../../user-dashboards/manager-dash-board/manager-dash-board.module';

const routes: Routes = [
  {
    path: '',
    component: WelcomepageComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    // ManagerDashBoardModule,
    RouterModule.forChild(routes),
    NgMarqueeModule
  
  ],
  declarations: [WelcomepageComponent]
})
export class WelcomepageModule { }
