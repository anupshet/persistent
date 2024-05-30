// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AnalyteSummaryView } from '../contracts';
import { PezContent } from '../contracts/models/data-management/pez.model';
import { ReviewSummary } from '../contracts/models/data-management/review-summary.model';
import { GlobalLabels } from '../contracts/models/global-labels.model';
import { BrReviewSummaryComponent } from '../review-summary';
import { isPreviousYear } from '../shared';

@Component({
  selector: 'br-analyte-summary-view',
  templateUrl: './analyte-summary-view.component.html',
  styleUrls: ['./analyte-summary-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrAnalyteSummaryViewComponent implements OnInit, OnChanges {
  public columnsToDisplay: string[] = [];
  @Input() translationLabels: any;
  @Input() analyteView: AnalyteSummaryView;
  @Input() productName: string;
  @Input() productLotNumber: string;
  @Input() historyData = {};
  @Input() globalLabels: GlobalLabels = {
    mean: 'mean9',
    sd: 'sd8',
    points: 'points7'
  };
  @Input() isSinglePageSummary: boolean;
  @Input() translationLabelDictionary: {};
  @Input() dateTimeOffset: string;
  @Input() displayNoData?: boolean;
  @Input() analyteNameNoData?: string;
  @Input() isSameYearEntry?: boolean;
  @Output() clicked?: any = new EventEmitter();

  public labels: any;
  public isPreviousYear: boolean;
  private destroy$ = new Subject<boolean>();

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.labels  = [
      this.translationLabels.mean,
      this.translationLabels.sd,
      this.translationLabels.points
    ];

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.labels  = [
        this.getTranslations('TRANSLATION.MEAN'),
        this.getTranslations('TRANSLATION.SD'),
        this.getTranslations('TRANSLATION.POINTS'),
      ];
    });

    if (this.analyteView) {
      this.columnsToDisplay.push('label');
      this.analyteView.cumulativeLevels.forEach(cl => {
        this.columnsToDisplay.push(cl.toString());
      });
      this.isPreviousYear = isPreviousYear(this.analyteView.analyteDateTime, new Date());
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.analyteView) {
      this.isPreviousYear = isPreviousYear(this.analyteView.analyteDateTime, new Date());
    }
  }

  public getIndexFromLevelSummary(cIndex: number): number {
    const cLevel = this.analyteView.cumulativeLevels[cIndex];
    const len = this.analyteView.levelDataSet.length;

    for (let i = 0; i < len; i++) {
      if (this.analyteView.levelDataSet[i].level === cLevel) {
        return i;
      }
    }
    return null;
  }

  openReviewSummaryDialog(): void {
    const reviewSummary: ReviewSummary = new ReviewSummary();
    reviewSummary.actions = [];
    reviewSummary.comments = [];
    reviewSummary.interactions = [];

    if (this.analyteView.userComments !== null) {
      this.analyteView.userComments.forEach(data => {
        const comment: PezContent = {
          userName: data.userFullName,
          dateTime: data.enterDateTime,
          text: data.content,
          pezDateTimeOffset: this.dateTimeOffset
        };
        reviewSummary.comments.push(comment);
      });
    }

    if (Object.keys(this.historyData).length) {
      this.historyData[this.analyteView.id].forEach((data: PezContent) => {
        if (!!data) {
          const interaction: PezContent = {
            userName: data.userName,
            dateTime: data.dateTime,
            text: data.text,
            pezDateTimeOffset: data.pezDateTimeOffset,
            labelHeader: data.labelHeader

          };
          reviewSummary.interactions.push(interaction);
        }
      });
    }

    this.dialog.open(BrReviewSummaryComponent, {
      panelClass: 'cdk-review-summary',
      backdropClass: 'cdk-overlay-review-summary',
      data: { reviewData: reviewSummary, dateTimeData: { month: this.analyteView?.analyteDateTime } }
    });
  }

  public onClicked(): void {
    this.clicked.emit();
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
