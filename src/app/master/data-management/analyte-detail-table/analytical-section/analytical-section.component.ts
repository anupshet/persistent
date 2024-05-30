/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { select } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { LabMonthLevel, SummaryStatisticsLabels } from 'br-component-library';

import { Run, RunsResult } from '../../../../contracts/models/data-management/runs-result.model';
import { UIConfigService } from '../../../../shared/services/ui-config.service';
import * as fromRoot from '../../../../state/app.state';
import * as stateSelector from '../../../../shared/state/selectors';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import * as navigationStateSelector from '../../../../shared/navigation/state/selectors';

@Component({
  selector: 'unext-analytical-section',
  templateUrl: './analytical-section.component.html',
  styleUrls: ['./analytical-section.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0', overflow: 'hidden' }),
        animate('150ms ease-in', style({ overflow: 'hidden', height: '0' })),
        animate('150ms ease-in', style({ overflow: 'hidden', height: '50px' })),
        animate('150ms ease-in', style({ overflow: 'hidden', height: '100px' })),
        animate('150ms ease-in', style({ overflow: 'hidden', height: '150px' })),
        animate('150ms ease-in', style({ overflow: 'visible', height: '200px' }))
      ]),
      transition(':leave', [
        style({ overflow: 'hidden' }),
        animate('150ms ease-in', style({ height: '200px' })),
        animate('150ms ease-in', style({ height: '150px' })),
        animate('150ms ease-in', style({ height: '100px' })),
        animate('150ms ease-in', style({ height: '50px' })),
        animate('150ms ease-in', style({ height: '0' }))
      ])
    ])]
})

export class AnalyticalSectionComponent implements OnInit, OnDestroy {
  public visible = true;
  public displayShowDataLabel = false;
  public summary = true;
  public summaryClick = false;
  public chart = true;
  public chartClick = false;
  public fullWidthLJChart = false;
  public animationFlag = false;
  protected summaryStatsLabels: SummaryStatisticsLabels;
  public suppressScrollX = false;
  protected destroy$ = new Subject<boolean>();
  permissions = Permissions;

  @Input() levelsInUse: Array<number>;
  @Input() decimalPlaces: Array<number>;
  @Input() monthSummaryByLevel: Array<LabMonthLevel>;
  @Input() runsResult: RunsResult;
  @Input() ljChartRuns: Array<Run>;
  @Input() labTimeZone: string;
  @Input() initDiffRuns: number;
  @Input() isSummary: boolean;
  navigationGetLocale$ = this.store.pipe(select(navigationStateSelector.getLocale));
  numberFormat = -1;

  constructor(
    private uiConfigAction: UIConfigService,
    private store: ngrxStore.Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService
  ) {
    this.summaryStatsLabels = this.getSummaryStatisticsTableLabels();
  }

  ngOnInit() {

    this.store.pipe(ngrxStore.select(stateSelector.getAnalyticalSectionState),
      takeUntil(this.destroy$)).subscribe((isAnalyticalSectionVisible) => {
        try {
          this.visible = isAnalyticalSectionVisible;
          this.displayShowDataLabel = !isAnalyticalSectionVisible;
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
              (componentInfo.AnalyticalSectionComponent + blankSpace + Operations.GetAnalyteSectionState)));
        }
      });
      this.navigationGetLocale$
      .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
      .subscribe(loc => {
        if (loc['numberFormat'] !== this.numberFormat) {
          const data = cloneDeep(this.monthSummaryByLevel);
          this.monthSummaryByLevel = data;
          this.numberFormat = loc['numberFormat'];
        }
      });
      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(async lang => {
        this.summaryStatsLabels = this.getSummaryStatisticsTableLabels();
      });
  }

  public toggleDiv(): void {
    this.visible = !this.visible;
    this.uiConfigAction.updateAnalyticalSectionState(this.visible);
    if (this.visible) {
      this.toggleShowDataLabel(0);
    } else {
      this.toggleShowDataLabel(700);
    }
  }

  private toggleShowDataLabel(timeoutInMiliseconds: number) {
    if (timeoutInMiliseconds < 1) {
      return this.displayShowDataLabel = !this.displayShowDataLabel;
    }
    setTimeout(() => this.displayShowDataLabel = !this.displayShowDataLabel, timeoutInMiliseconds);
  }

  public toggleSummary(): void {
    this.summary = !this.summary;
    this.updateChartWidth();
    // bug fix 192323 either LJ or summary stats must be shown at all times
    this.updateCheckboxClick();
  }

  public toggleChart(event): void {
    this.chart = !this.chart;
    this.updateChartWidth();
    // bug fix 192323 either LJ or summary stats must be shown at all times
    this.updateCheckboxClick();
  }


  public updateCheckboxClick(): void {
    if (this.summary && !this.chart) {
      // LJ cannot be turned off as Summary is disabled
      this.summaryClick = false;
      this.chartClick = true;
    } else if (!this.summary && this.chart) {
      // Summary cannot be turned off as LJ is disabled
      this.summaryClick = true;
      this.chartClick = false;
    } else if (this.summary && this.chart) {
      // both check boxes selected, either can be changed
      this.summaryClick = false;
      this.chartClick = false;
    }
  }

  private updateChartWidth(): void {
    if (this.summary && this.chart) {
      this.fullWidthLJChart = false;
    } else if (!this.summary && this.chart) {
      this.fullWidthLJChart = true;
    }

    this.suppressScrollX = (this.summary && this.chart) ? false : true;
  }

  private getSummaryStatisticsTableLabels(): SummaryStatisticsLabels {
    try {

      return {
        month: this.getTranslations('TRANSLATION.MON'),
        cumulative: this.getTranslations('TRANSLATION.CUM'),
      level: this.getTranslations('TRANSLATION.LEVEL'),
        mean: this.getTranslations('TRANSLATION.MEAN'),
        sd: this.getTranslations('TRANSLATION.SD'),
        cv: this.getTranslations('TRANSLATION.CV'),
        points: this.getTranslations('TRANSLATION.POINTS')
      } as SummaryStatisticsLabels;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyticalSectionComponent + blankSpace + Operations.GetSummaryStatisticsTableLabels)));
    }
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
