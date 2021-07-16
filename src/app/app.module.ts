import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { NgMarqueeModule } from 'ng-marquee';

import { CalendarModule } from 'primeng/calendar';
import { Time } from '@angular/common';
import { IgxDatePickerModule } from 'igniteui-angular';

import { GooglePieChartService } from './extra-files/piechart-file/Services/google-pie-chart.service';
// import { PieChartComponent } from './extra-files/piechart-file/Dashboard/Charts/piechart.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ResponsiveService } from './service/responsive.service';

import { NgDatepickerModule } from 'ng2-datepicker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { JwtInterceptor } from './control-and-view/dashboard/login/login.component';
import { DataServiceTokenStorageService } from './service/DataServiceTokenStorage.service';


import { AlertdialogComponent } from './control-and-view/dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent } from './control-and-view/dialog/confirmationdialog/confirmationdialog.component';
import { PromptdialogComponent } from './control-and-view/dialog/promptdialog/promptdialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    AlertdialogComponent,
    ConfirmationdialogComponent,
    PromptdialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgMarqueeModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // CalendarModule,
    // IgxDatePickerModule,NgDatepickerModule,
    // NgMultiSelectDropDownModule.forRoot()

    MatDialogModule, MatButtonModule
  ],
  providers: [GooglePieChartService, ResponsiveService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, DataServiceTokenStorageService],
  bootstrap: [AppComponent],
  entryComponents: [AlertdialogComponent,
    ConfirmationdialogComponent, PromptdialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
  time: Time; //for timepicker
}
