import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    window.sessionStorage.clear();
    // console.log("Get out");
    this.router.navigateByUrl('/');
  }

}
