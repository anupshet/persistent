// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

// Colors for Advanced LJ levels
export const levelColors: Array<string> = [
  '#00C5C5',
  '#004ADE',
  '#9F41F9',
  '#FF3CAB',
  '#FF7F0E',
  '#8C564B',
  '#BD007D',
  '#009FFF',
  '#5658A5'
];

// Colors for Advanced LJ Chart Events
export const advancedLjChartEventCalibratorChangeBG = '#9F9F9F'; // Calibrator lot change background
export const advancedLjChartEventCalibratorChange = '#000000'; // Calibrator lot change font
export const advancedLjChartEventReagentChangeBG = '#000000'; // Reagent lot change background
export const advancedLjChartEventReagentChange = '#ffffff'; // Reagent lot change font
export const advancedLjChartEventMeanChangeBG = '#dfdfdf'; // Mean change background
export const advancedLjChartEventMeanChange = '#000000'; // Mean change font
export const advancedLjChartEventSdChangeBG = '#dfdfdf'; // Sd change background
export const advancedLjChartEventSdChange = '#000000'; // Sd change font
export const advancedLjChartEventMultiChange = '#d6d8d9'; // For multi event box
export const advancedLjChartEventMultiChangeBG = '#fefefe'; // For Multi Event box

// Chart size constants
export const advancedLjPlotHeightTwoCharts = 700;
export const advancedLjPlotHeightPerChart = 280;
export const advancedLjMaxExportWidth = 1400;

// Chart time constants
export const advancedLjToggleDebounceTime = 300;    // Milliseconds

// Chart events
export const advancedLjPlotEventAnnotationOffset = 33;
export const advancedLjPlotyShiftShim = 10; // This moves the stack down to not interfere with the header on the level AJT Bug fix 219076
export const advancedLjPlotEventAnnotationPoleHeightTop = 5000;  // Pixels
export const advancedLjPlotEventAnnotationPoleHeightBottom = -5000;  // Pixels
export const advancedLjPlotEventAnnotationPoleShapeType = 'line';
export const advancedLjPlotEventAnnotationPoleColor = 'rgb(100, 100, 100)';
export const advancedLjPlotEventAnnotationPoleWidth = 1;
export const advancedLjPlotEventAnnotationPoleLayer = 'layer';
export const advancedLjPlotEventAnnotationPoleHeightIncrement = 'pixel';
export const advancedLjPlotEventAnnotationHeight = 25;
export const advancedLjPlotEventAnnotationFontFamily = 'lato';
export const advancedLjPlotEventAnnotationFontSize = 14;
export const advancedLjPlotEventAnnotationFontBold = 'true';
export const advancedLjPlotEventAnnotationTextAlign = 'right';
export const advancedLjPlotEventAnnotationBorderColor = '#c7c7c7';
export const advancedLjPlotEventAnnotationBorderWidth = 1;
export const advancedLjPlotEventAnnotationBorderPad = 2;
export const advancedLjPlotEventAnnotationOpacity = 1;

// Advanced LJ y-axis range in SD
export const advancedLjYaxisSdRange = 3;
export const advancedLjOutOfRangePosDivisor = 12;

// Axis prefixes
export const xAxisPrefix = 'x';
export const yAxisPrefix = 'y';

// Special point colors
export const advancedLjSpecialPointColorDefault = '#000000';
export const advancedLjSpecialPointColorWarning = '#dbb14d';
export const advancedLjSpecialPointColorReject = '#ff3333';
export const advancedLjOutOfRangeColor = '#ff3333';

// Special point symbols
export const advancedLjSpecialMarkerSymbol = 'circle';
export const advancedLjCrossSymbol = 'x';
export const advancedLjOutOfRangeLowSymbol = 'triangle-down';
export const advancedLjOutOfRangeHighSymbol = 'triangle-up';

// Line size
export const advancedLjLineSize = 2;
export const advancedLjMeanLineSize = 2;
export const advancedLjMeanDashLineSize = 1;

// Point size
export const advancedLjPointSize = 8;
export const advancedLjSpecialPointSize = 11;
export const advancedLjCrossSize = 10;
export const advancedLjOutOfRangeSize = 10;

// Advanced LJ Plotly constants
export const advancedLjPlotlyModeMarkers = 'markers';
export const advancedLjPlotlyModeLinesAndMarkers = 'lines+markers';
export const advancedLjPlotlyTypeScatter = 'scattergl';
export const advancedLjPlotlyGridPatternIndependent = 'independent';
export const advancedLjPlotlyGridRowOrderBottomToTop = 'bottom to top';
export const advancedLjPlotlyAxisTypeCategory = 'category';
export const advancedLjPlotlyXaxisName = 'xaxis';
export const advancedLjPlotlyYaxisName = 'yaxis';
export const advancedLjSkipHover = 'skip';
export const advancedLjCategoryOrder = 'array';
export const advancedLjShapesProperty = 'shapes';
export const advancedLjLayerAbove = 'above';
export const advancedLjLayerBelow = 'below';
export const advancedLjDragModeProperty = 'dragmode';
export const advancedLjDragModeValue = 'pan';

// Mean and SD
export const advancedLj1SdValue = 1;
export const advancedLj2SdValue = 2;
export const advancedLj3SdValue = 3;
export const advancedLjMeanLineColor = '#808080';
export const advancedLj2SdRegionColor = '#fff7e0';
export const advancedLj3SdRegionColor = '#ffebee';

// Chart configuration
export const advancedLjPlotlyButtonsToRemove = ['toImage', 'select2d', 'lasso2d', 'autoScale2d', 'toggleSpikelines', 'hoverClosestCartesian', 'hoverCompareCartesian'];

// HoverLabel
export const advancedLjBgColor = '#FFF';
export const advancedLjAlignLeft = 'left';
export const advancedLjActionStringSpace = '{actionStringSpace}';

// Axis domain calculation
export const advancedLjDynamicSpacingSubplotLimit = 5;
export const advancedLjAdjustmentFactor = 0.1;
export const advancedLjStaticSubplotSpacing = 0.4;

// Date formatting
export const advancedLjDateFormatMonth = 'short';
export const advancedLjDateFormatDay = '2-digit';
export const advancedLjDateFormatHour = '2-digit';
export const advancedLjDateFormatMinute = '2-digit';
export const advancedLjDateFormatHour12 = true;

//annotation width aligment
export const annotationCanvasType = "2d";
export const annotationWidthAligment = 3;

//Retrive mean for dash Line
export const advancedLjSecondaryAxisItemColor = '#00a651';
export const advancedLjDashMeanShapeDash = 'dash';
export const advancedLjDashMeanShapeSolid = 'solid';

//secondary yaxis
export const advancedLjSecondaryYAxisPosition = 'right';
export const advancedLjSecondaryYAxisNoShowGrid = false;
export const advancedLjSecondaryYAxisTickvalueLength = 7;
export const advancedLjSecondaryYAxisIncrementValue = 1;
export const advancedLjSecondaryYAxisMarkerColor = "#000000";
export const advancedLjSecondaryYAxisMarkerSize = 1

//statistics TimeFrames
export const advancedLjStatisticsCumulative = '000101';
export const advancedLjStatisticsDays60 = 1;
export const advancedLjStatisticsDays90 = 2;
export const advancedLjFirstDay = 1;

//No of instrutment display block
export const annotationDataTypePeer = "Peer";
export const annotationDataTypeMethod = "Method";
export const advancedLjInstrumentCountColor = '#ffffff';
export const advancedLjInstrumentCountFont = 16;

//Plotting graph by range
export const advancedLjPreviousPoint = 0.1;
export const advancedLjNextPoint = 0.9;
export const advancedLjRangeIncrement = 0.05;
export const incrementYAxisRangeValue = 0.2;

//For datapoints hover events
export const advanceLjCursor = 'pointer';
export const advanceLjDragLayer = '.draglayer';

// TickMode
export const tickMode = 'array';
