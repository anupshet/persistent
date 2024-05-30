export class LabMonthLevel {
  controlLevel: number;
  month: BaseSummary;
  cumul: BaseSummary;
}

export class BaseSummary {
  mean: number;
  sd: number;
  cv: number;
  numPoints: number;
  nPts?: number;
  isAccepted?: number;
}

export class SummaryStatisticsLabels {
  month: string;
  cumulative: string;
  level: string;
  mean: string;
  sd: string;
  cv: string;
  points: string;
}
