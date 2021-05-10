import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from 'rxjs';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    window.sessionStorage.clear();
    document.cookie = 'refresh-token' + '=; expires=' + new Date();
    this.router.navigateByUrl('/');
  }

}
