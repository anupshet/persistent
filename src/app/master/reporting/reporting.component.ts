// © 2022 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { forwardSlash } from '../..//core/config/constants/general.const';

@Component({
  selector: 'unext-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportingComponent implements OnInit, OnDestroy {
  tabIndex = 0;
  constructor(
    private router: Router,
    private navigationService: NavigationService,
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects.includes(unRouting.reporting.newReports)) {
          this.tabIndex = 0;
        } else {
          this.navigationService.setSelectedReportNotificationId('');
          this.tabIndex = 1;
        }
      }
    });
  }

  ngOnInit() {
  }

  onTabSelect(selectedTab) {
    if (selectedTab.index === 0) {
      this.router.navigate([unRouting.reports + forwardSlash + unRouting.reporting.newReports]);
    } else {
      this.navigationService.setSelectedReportNotificationId('');
      this.router.navigate([unRouting.reports + forwardSlash + unRouting.reporting.pastReports]);
    }

  }

  ngOnDestroy(): void {
  }

}

