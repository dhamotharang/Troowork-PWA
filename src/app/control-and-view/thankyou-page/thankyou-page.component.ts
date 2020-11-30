import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-thankyou-page',
  templateUrl: './thankyou-page.component.html',
  styleUrls: ['./thankyou-page.component.scss']
})
export class ThankyouPageComponent implements OnInit {
  type$;
  flag;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.type$ = params.type);
  }

  ngOnInit() {
    if (this.type$ === "feedback") {
      this.flag = 1;
    } else if (this.type$ === "workRequest") {
      this.flag = 2;
    }
  }

}
