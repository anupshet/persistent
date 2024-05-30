// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'unext-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss']
})
export class GreetingComponent implements OnInit {
  @Input() firstName: string;
  @Input() timeZone: string;
  @Input() smallFont: boolean;
  @Input() displayInline: boolean;

  currentDateTime: Date = new Date();
  constructor() {
  }

  ngOnInit() {
  }

}
