import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QrCodeViewFeedbackComponent } from "./qr-code-view-feedback.component";
import { NgxQRCodeModule } from 'ngx-qrcode2';

const routes: Routes = [
  {
    path: '',
    component: QrCodeViewFeedbackComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    FormsModule, ReactiveFormsModule,
    NgxQRCodeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QrCodeViewFeedbackComponent]
})
export class QrCodeViewFeedbackModule { }
