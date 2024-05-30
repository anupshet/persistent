/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PointDataResultStatus } from '../contracts';
import { PointLevelDataColumns } from '../contracts/enums/point-level-data-columns.enum';
import { AnalytePointView, AnalyteView } from '../contracts/models/data-management/data-entry/analyte-entry.model';
import { PezContent } from '../contracts/models/data-management/pez.model';
import { ReviewSummary } from '../contracts/models/data-management/review-summary.model';
import { BrReviewSummaryComponent } from '../review-summary';

const POINT_DATE_TIME = 'pointDateTime';

@Component({
  selector: 'br-analyte-point-view',
  templateUrl: './analyte-point-view.component.html',
  styleUrls: ['./analyte-point-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrAnalytePointViewComponent implements OnInit {

  @Input() public analytePointView: AnalytePointView;
  @Input() public productName: string;
  @Input() public productLotNumber: string;
  @Input() public displayedLevelDataColumns: Set<PointLevelDataColumns>;
  @Input() public showAnalyteNameHeader: boolean;
  @Input() public dateTimeOffset: string;
  @Input() public displayNoData?: boolean;
  @Input() public analyteNameNoData?: string;

  public columnsToDisplay: string[] = [];

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    if (this.analytePointView) {
      this.columnsToDisplay.push(POINT_DATE_TIME); // display date first
      this.analytePointView.cumulativeLevels.forEach(cl => {
        this.columnsToDisplay.push(cl.toString()); // display level columns
      });
    }
  }

  public getIndexFromLevelSummary(columnIndex: number): number {
    const columnLevel = this.analytePointView.cumulativeLevels[columnIndex];

    for (let levelDataIndex = 0; levelDataIndex < this.analytePointView.levelDataSet.length; ++levelDataIndex) {
      if (this.analytePointView.levelDataSet[levelDataIndex].level === columnLevel) {
        return levelDataIndex;
      }
    }
    return null;
  }

  public getDataSource(analyteView: AnalytePointView): AnalyteView[] {
    return [analyteView];
  }

  public showAnalyteName(analyteView: AnalytePointView): boolean {
    if (this.showAnalyteNameHeader && analyteView && analyteView.analyteName) {
      return true;
    } else {
      return false;
    }
  }

  public showValueColumn(): boolean {
    return this.displayedLevelDataColumns.has(PointLevelDataColumns.Value);
  }

  public applyAlternateColumnStyling(columnIndex: number): boolean {
    return !this.isLevelIndexOdd(columnIndex);
  }

  private isLevelIndexOdd(levelIndex: number): boolean {
    return levelIndex % 2 !== 0;
  }

  public getBorderColor(resultStatus: PointDataResultStatus): string {
    switch (resultStatus) {
      case PointDataResultStatus.Warning:
        return 'yellow';
      case PointDataResultStatus.Accept:
      case PointDataResultStatus.Reject:
        return 'red';
      default:
        return '';
    }
  }

  openReviewSummaryDialog(): void {
    const userActions = this.analytePointView.userActions;
    const userComments = this.analytePointView.userComments;
    const userInteractions = this.analytePointView.userInteractions;
    const reviewSummary: ReviewSummary = new ReviewSummary();
    reviewSummary.actions = [];
    reviewSummary.comments = [];
    reviewSummary.interactions = [];

    if (userActions && userActions.length > 0) {
      userActions.forEach(data => {
        const action: PezContent = {
          userName: data.userFullName,
          dateTime: data.enterDateTime,
          text: data.actionName,
          pezDateTimeOffset: this.dateTimeOffset,
          labelHeader: 'AJ100',
          labelAt: 'AT-AT'
        };
        reviewSummary.actions.push(action);
      });
    }

    if (userComments && userComments.length > 0) {
      userComments.forEach(data => {
        const comment: PezContent = {
          userName: data.userFullName,
          dateTime: data.enterDateTime,
          text: data.content,
          pezDateTimeOffset: this.dateTimeOffset,
          labelHeader: 'AJ100',
          labelAt: 'AT-AT'
        };
        reviewSummary.comments.push(comment);
      });
    }

    if (userInteractions && userInteractions.length > 0) {
      userInteractions.forEach(data => {
        const interaction: PezContent = {
          userName: data.userFullName,
          dateTime: data.enterDateTime,
          text: data.interactionType.toString(),
          pezDateTimeOffset: this.dateTimeOffset,
          labelHeader: 'AJ100',
          labelAt: 'AT-AT'
        };
        reviewSummary.interactions.push(interaction);
      });
    }

    this.dialog.open(BrReviewSummaryComponent, {
      panelClass: 'cdk-review-summary',
      backdropClass: 'cdk-overlay-review-summary',
      data: { reviewData: reviewSummary }
    });
  }

  getAllRulesViolated(ruleViolations): string {
    let returnString = 'No Rules Violated';
    if (ruleViolations && ruleViolations.length > 0) {
      returnString = '';
      ruleViolations.forEach(ruleViolated => {
        returnString += ruleViolated + ' ';
      });
    }
    return returnString;
  }
}
