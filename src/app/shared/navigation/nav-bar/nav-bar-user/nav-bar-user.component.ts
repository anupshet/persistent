// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


import * as fromRoot from '../../../../state/app.state';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { LabLocation } from '../../../../../app/contracts/models/lab-setup';
import { ConfirmNavigateGuard } from '../../../../master/reporting/shared/guard/confirm-navigate.guard';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';

@Component({
  selector: 'unext-nav-bar-user',
  templateUrl: './nav-bar-user.component.html',
  styleUrls: ['./nav-bar-user.component.scss']
})

export class NavBarUserComponent implements OnInit {
  @Input() displayName: string = null;
  @Input() navIconName: string;
  @Output() logOut = new EventEmitter<boolean>();


  labLocation: LabLocation;
  private destroy$ = new Subject<boolean>();

  constructor(private confirmNavigate: ConfirmNavigateGuard,
    private router: Router,
    public translate: TranslateService,
    private store: Store<fromRoot.State>) { }


  ngOnInit() {
  }

  async logOutOfApp(): Promise<void> {
    if (this.router.url.includes(unRouting.reports)) {
      const result = await this.confirmNavigate.confirmationModal();
      if (!result) {
        return;
      }
    }
    this.store
      .pipe(select(sharedStateSelector.getCurrentLabLocation))
      .pipe(
        filter((labLocation) => !!labLocation),
        takeUntil(this.destroy$)
      )
      .subscribe((labLocation) => {
        this.labLocation = labLocation;
      });
    this.logOut.emit(true);
  }

}
