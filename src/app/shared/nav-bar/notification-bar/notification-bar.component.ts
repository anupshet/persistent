import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'unext-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {
  @Input() numberOfNotifications = 10;

  // these will need to be localized when we get real values here
  @Input() notifications: Array<{ description: string; isLoading: boolean }> = [
    { description: 'Calculating C-peptide value', isLoading: true },
    { description: 'Analyte’s Unity Data Reimported', isLoading: false }
  ];

  constructor() {}

  ngOnInit() {}
}
