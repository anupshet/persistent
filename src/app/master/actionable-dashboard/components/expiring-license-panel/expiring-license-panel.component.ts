import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'unext-expiring-license-panel',
  templateUrl: './expiring-license-panel.component.html',
  styleUrls: ['./expiring-license-panel.component.scss']
})
export class ExpiringLicensePanelComponent implements OnInit {
  @Input() numberOfDaysToExpire: number;
  @Input() licenseExpirationDate: Date;
  constructor() { }

  ngOnInit() {
  }

}
