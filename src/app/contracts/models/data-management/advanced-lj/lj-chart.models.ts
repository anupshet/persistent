// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Action } from 'br-component-library';
import { LjChartEventType, LjChartMode, LjChartShapeForm } from '../../../enums/advanced-lj/lj-chart.enum';

// The object that is passed to the AdvancedLjChartComponent and used to generate the advanced LJ chart.
export class LjChart {
  constructor() {
    this.data = new Array<LjChartDataLevel | LjChartDataItem>();
    this.config = new LjChartConfig();
  };

  data:  Array<LjChartDataLevel | LjChartDataItem>; // The data supplied to the chart for the traces and other markers that need to be plotted.
  config: LjChartConfig;  // The configuration of the axes and any mean/SD lines and regions to be drawn.
  mode: LjChartMode;  // The type of charts that will be rendered.
}

export class LjChartDataLevel {
  x: string[];  // Dates are in the format of yyyy-mm-dd hh:nn:ss, but may use a string like 'Jun 09' for category plots (where x-axis is a list of strings and it’s configuration is type: 'category').
  y: number[];  // The value on the y axis
  text: object[]; // An array of JSON objects that correspond to each x and y element and contains the items needed in the hover template (tooltip) popup.
  showLine: boolean;  // Show connecting lines
  lineColor: string;
  xAxisName: string;  // Matches this trace with the x-axis. If sharing one x and y axis, leave as null.
  yAxisName: string;  // Matches this trace with the y-axis. If sharing one x and y axis, leave as null.
  hovertemplate: string;
  level: number;
  mode: string;
}

export class LjChartDataItem {
  x: string[];  // Dates are in the format of yyyy-mm-dd hh:nn:ss, but may use a string like ‘Jun 09’ for category plots (where x-axis is a list of strings and it’s configuration is type: 'category').
  y: number[];  // The value on the y axis
  text: object[]; // An array of JSON objects that correspond to each x and y element and contains the items needed in the hover template (tooltip) popup.
  marker: LjChartMarker;  // The configuration of the marker
  xAxisName: string;  // Matches this trace with the x-axis. If sharing one x and y axis, leave as null.
  yAxisName: string;  // Matches this trace with the y-axis. If sharing one x and y axis, leave as null.
  showHoverText: boolean; // If false, don't display the hover text box.
}

export class LjChartMarker {
  symbol: string; // The marker's symbol (circle, square, x, etc.). See options on plotly’s documentation site.
  color: string;  // The marker's color
  size: number;   // The marker's size
}

export class LjChartConfig {
  constructor() {
    this.xAxis = new Array<LjChartAxis>();
    this.yAxis = new Array<LjChartAxis>();
    this.shapes =  new Array<LjChartShape>();
    this.secondaryYAxis =  new Array<LjChartSecondaryAxis>();
  }

  xAxis: LjChartAxis[]; // Each axis corresponds to one plot.
  yAxis: LjChartAxis[]; // Each axis corresponds to one plot.
  shapes: Array<LjChartShape>; // The shapes like lines and rectangular regions to be added to the charts. The first array corresponds to the plot. The second array is the list of shapes for that plot.
  chartEvents?: Array<LjChartEvent>; // Chart events such as changes in Reagent/Calibrator Lots, Mean/SD evalutation types
  secondaryYAxis? : LjChartSecondaryAxis[]; // Each secondary y axis corresponds to one plot.
}

export class LjChartAxis {
  categoryArray: Array<string>;
  range: string[] | number[]; // The visible range that is in the plot
  matches: string;  // Used to synchronize subplots together for zoom and pan
  byZscore: boolean;  // Is axis by z-score?
  showTitle: boolean; // Display the title above the chart
  levels: Array<number>;  // Array of levels - multiple if overlay, one otherwise or if only one level analyte
  isFixedMean: boolean; // Is fixed mean?
  isFixedSd: boolean; // Is fixed SD?
}

export class LjChartShape {
  type: LjChartShapeForm;
  x0: string;  // Starting x position of line or rectangle
  y0: number; // Starting y position of line or rectangle
  x1: string; // Ending x position of line or rectangle
  y1: number; // Ending y position of line or rectangle
  color: string;  // Line or region color
  xAxisName: string;  // Matches this trace with the x-axis. If sharing one x and y axis, leave as null.
  yAxisName: string;  // Matches this trace with the y-axis. If sharing one x and y axis, leave as null.
  layer: string;  // Layer this above or below
  line?: {
    width?: number,
    color?: string,
    dash?: string
  }
}

export class LjHoverDetail {
  level: number;
  dateTime: Date;
  mean: number;
  sd: number;
  cv: number;
  zScore: number;
  isAccepted: boolean;
  reasons: Array<string>;
  resultValue: number;
  decimalPlace?:number;
  userActions?: Array<Action>;
}

export class LjChartEvent {
  eventType: LjChartEventType;
  targetXIndex: number;
  controlLevel: number;
  yValue: number;
  text: string;
  color: string;
  bgColor: string;
  testSpecId?: number;
  xAxis?: string;
  xShift: number = 0;
  yShift: number = 0;
}

export class LjChartSecondaryAxis {
  range: string[] | number[]; // The visible range that is in the plot
  titlefont: {
    color : string
  };
  tickfont: {
    color : string
  };
  overlaying : string;
  side : string;
  showgrid: boolean;
  tickvals : Array<number>;
}
