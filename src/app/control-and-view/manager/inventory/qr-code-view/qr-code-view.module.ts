import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QrCodeViewComponent } from "./qr-code-view.component";
import { NgxQRCodeModule } from 'ngx-qrcode2';

const routes: Routes = [
  {
    path: '',
    component: QrCodeViewComponent
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
  declarations: [QrCodeViewComponent]
})
export class QrCodeViewModule { }
