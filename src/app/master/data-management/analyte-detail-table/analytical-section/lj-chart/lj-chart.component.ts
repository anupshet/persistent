/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import * as ngrxStore from '@ngrx/store';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { Run, RunsResult } from '../../../../../contracts/models/data-management/runs-result.model';
import { dataManagement } from '../../../../../core/config/constants/data-management.const';
import { unsubscribe } from '../../../../../core/helpers/rxjs-helper';
import { SideNavService } from '../../../../../shared/side-nav/side-nav.service';
import { LevelToggleService } from '../level-toggle/level-toggle.service';
import { LjChartPopupService } from './lj-chart-popup/lj-chart-popup.service';
import { LJChartConfig } from './lj-chart.config';
import { LJChart } from './lj.chart';
import * as fromRoot from '../../../../../state/app.state';
import * as navigationStateSelector from '../../../../../shared/navigation/state/selectors';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../../core/config/constants/error-logging.const';
import { AdvancedLjPanelComponent } from '../../../advanced-lj/advanced-lj-panel/advanced-lj-panel.component';
import { AuditTrackingEvent } from '../../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { LocalizationService } from '../../../../../shared/navigation/services/localizaton.service';


@Component({
  selector: 'unext-lj-chart',
  templateUrl: './lj-chart.component.html',
  styleUrls: ['./lj-chart.component.scss']
})
export class LjChartComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild('target', { static: true }) target;
  @ViewChild('chartContainer') chartContainer: ElementRef;

  @Input() fullWidth: boolean;
  @Input() levelsInUse: Array<number>;
  @Input() runsResult: RunsResult;
  @Input() ljChartRuns: Array<Run>;
  @Input() labTimeZone: string;
  @Input() initDiffRuns: number;

  private chart: LJChart;
  private levelStats: Array<boolean>;
  private destroy$ = new Subject<boolean>();
  private sideNavSubscription: Subscription;
  private levelToggleStateSubscription: Subscription;
  locale: any = { lcid: 'en-US' };
  navigationGetLocale$ = this.store.pipe(ngrxStore.select(navigationStateSelector.getLocale));
  constructor(
    private levelToggleService: LevelToggleService,
    public ljChartPopupService: LjChartPopupService,
    private store: ngrxStore.Store<fromRoot.State>,
    private sideNavService: SideNavService,
    private errorLoggerService: ErrorLoggerService,
    private dialog: MatDialog,
    private _appNavigationService: AppNavigationTrackingService,
    private localizationService: LocalizationService
    ) { this.navigationGetLocale$
      .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
      .subscribe(loc => {
          this.locale = loc;
          this.render();
      });
    }

  ngOnInit() {
    try {
      this.runsResult = new RunsResult();

      this.chart = new LJChart(
        this.target.nativeElement,
        this.ljChartPopupService,
        this.localizationService,
        this.store
      );

      this.levelToggleStateSubscription = this.levelToggleService.levelStates.subscribe(
        levelStates => {
          this.levelStats = levelStates;
          this.chart.updateDisplayLevels(levelStates);
        }
      );

      this.levelStats = new Array<boolean>();
      this.levelsInUse.forEach(() => {
        this.levelStats.push(true);
      });

      this.sideNavSubscription = this.sideNavService
        .getNavOpenState()
        .subscribe(() => {
          this.render();
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelToggleComponent + blankSpace + Operations.InitLJChart)));
    }
  }

  ngOnChanges(): void {
    try {
      if (this.ljChartRuns == null) {
        this.clearChart();
      } else {
        this.render();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelToggleComponent + blankSpace + Operations.RenderCharts)));
    }
  }

  ngOnDestroy() {
    unsubscribe(this.sideNavSubscription);
    unsubscribe(this.levelToggleStateSubscription);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.ljChartPopupService.hide();
  }

  private render(): void {
    setTimeout(() => {
      LJChartConfig.width = this.chartContainer.nativeElement.offsetWidth - 60;
      const editedData = this.runsResult;
      if (this.fullWidth) {
        editedData.runs = this.ljChartRuns.slice(0, dataManagement.ljChartFullRuns);
      } else {
        editedData.runs = this.ljChartRuns.slice(0 + this.initDiffRuns, dataManagement.ljChartHalfRuns + this.initDiffRuns);
      }
      editedData.labTimeZone = this.labTimeZone;
      this.chart.levelsInUse = this.levelsInUse;
      this.chart.render(editedData);
      this.chart.updateDisplayLevels(this.levelStats);
    });
  }

  private clearChart(): void {
    LJChartConfig.width = this.chartContainer.nativeElement.offsetWidth - 60;
    const runsResult: RunsResult = {
      runs: [],
      reagentLots: [],
      calibratorLots: [],
      labTimeZone: ''
    };

    this.chart.render(runsResult);
  }

  openAdvancedLj(): void {
    const dialogRef = this.dialog.open(AdvancedLjPanelComponent, {
      panelClass: 'cdk-AdvancedLj',
    });
        this.updateAuditTrailData();
  }

  updateAuditTrailData(): void {
    this._appNavigationService.auditTrailViewData(AuditTrackingEvent.AdvancedLJChart);
  }
}
