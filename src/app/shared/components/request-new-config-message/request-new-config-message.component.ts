import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'unext-request-new-config-message',
  templateUrl: './request-new-config-message.component.html',
  styleUrls: ['./request-new-config-message.component.scss']
})
export class RequestNewConfigMessageComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
