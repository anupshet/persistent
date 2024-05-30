// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

// The events that are shown on the chart.
export enum LjChartEventType {
  ReagentLotChange = 'R',
  CalibratorLotChange = 'C',
  MeanChange = 'M',
  SdChange = 'SD'
}

// The various modes of the chart.
export enum LjChartMode {
  Value = 1,
  Overlay = 2,
  Zscore = 3,
  Date = 4,
}

export enum LjChartXAxisType {
  Sequence = 1,
  Date = 2
}

export enum LjChartYAxisType {
  EvalMean = 1,
  CumulativeMean = 2,
  Zscore = 3
}

export enum LjChartShapeType {
  MeanLine = 1,
  Sd2Region = 2,
  Sd3Region = 3
}

export enum LjChartShapeForm {
  Line = 'line',
  Rectangle = 'rect'
}
