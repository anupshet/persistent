/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Component, OnDestroy, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Subject, combineLatest, of, Subscription } from 'rxjs';
import { filter, flatMap, tap, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { SideNavService } from '../../shared/side-nav/side-nav.service';
import { DataManagementSpinnerService } from '../../shared/services/data-management-spinner.service';
import { DataManagementService } from '../../shared/services/data-management.service';
import * as fromRoot from '../../state/app.state';
import * as dataManagementActions from './state/actions/data-management.actions';
import { getCurrentSelectedNode } from '../../shared/navigation/state/selectors';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../core/config/constants/error-logging.const';
import { unsubscribe } from '../../core/helpers/rxjs-helper';

@Component({
  selector: 'unext-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})
export class DataManagementComponent implements OnInit, OnDestroy, AfterViewChecked {
  isSideNavOpen = false;

  private destroy$ = new Subject<boolean>();
  private selectedNodeSubscription: Subscription;
  private sideNavServiceSubscription: Subscription;

  constructor(
    private sideNavService: SideNavService,
    private route: ActivatedRoute,
    private dataManagementService: DataManagementService,
    public dataManagementSpinnerService: DataManagementSpinnerService,
    public changeDetectionRef: ChangeDetectorRef,
    private store: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private router: Router
  ) {
    if (this.router.events) {
      this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
        if (event instanceof NavigationEnd && this.selectedNodeSubscription) {
          // unsubscribe previous subscription and subscribe again when component is not destroyed
          unsubscribe(this.selectedNodeSubscription);
          unsubscribe(this.sideNavServiceSubscription);
          this.initialize();
        }
      });
    }
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.selectedNodeSubscription = this.route.params
      .pipe(flatMap((params: Params) => {
        const entityId: string = params.id;
        const entityType: number = +params.type;
        return combineLatest(of(entityId),
          of(entityType),
          this.store.pipe(select(getCurrentSelectedNode)));
      }),
        filter(([entityId, entityType, selectedNode]) => !!selectedNode && selectedNode.id === entityId),
      )
      .subscribe(([entityId, entityType, selectedNode]) => {
        try {
          this.dataManagementService.updateEntityInfo(entityId, entityType, selectedNode);
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.DataManagementComponent + blankSpace + Operations.EntityDetails)));
        }
      });

    this.sideNavServiceSubscription = this.sideNavService
      .getNavOpenState()
      .pipe(takeUntil(this.destroy$),
        tap(res => this.isSideNavOpen = res))
      .subscribe();
  }

  ngAfterViewChecked() {
    if (!this.changeDetectionRef['destroyed']) {
      this.changeDetectionRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(dataManagementActions.ResetDataManagementInfo());
    unsubscribe(this.selectedNodeSubscription);
    unsubscribe(this.sideNavServiceSubscription);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
