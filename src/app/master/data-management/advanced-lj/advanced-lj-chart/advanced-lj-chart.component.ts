/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';

import { LjChart, LjChartDataItem, LjChartDataLevel, LjChartEvent, LjChartShape } from '../../../../contracts/models/data-management/advanced-lj/lj-chart.models';
import * as AdvancedLjConst from '../../../../core/config/constants/advanced-lj.const';
import {
  advancedLjAdjustmentFactor,
  advancedLjCategoryOrder, advancedLjDragModeProperty, advancedLjDragModeValue, advancedLjDynamicSpacingSubplotLimit, advancedLjLineSize, advancedLjMaxExportWidth,
  advancedLjMeanLineSize, advancedLjPlotHeightPerChart, advancedLjPlotHeightTwoCharts, advancedLjPlotlyAxisTypeCategory,
  advancedLjPlotlyButtonsToRemove, advancedLjPlotlyGridPatternIndependent, advancedLjPlotlyGridRowOrderBottomToTop, advancedLjPlotlyModeLinesAndMarkers,
  advancedLjPlotlyModeMarkers, advancedLjPlotlyTypeScatter, advancedLjPlotlyXaxisName, advancedLjPlotlyYaxisName, advancedLjPointSize,
  advancedLjShapesProperty, advancedLjSkipHover, advancedLjStaticSubplotSpacing, advancedLjDashMeanShapeSolid, advancedLjSecondaryYAxisIncrementValue,
  advancedLjSecondaryYAxisMarkerColor,yAxisPrefix,advancedLjSecondaryYAxisMarkerSize,advancedLjPlotEventAnnotationFontFamily,
  advancedLjPlotEventAnnotationFontSize, advancedLjSecondaryAxisItemColor,
  advancedLjInstrumentCountFont, advancedLjInstrumentCountColor, advancedLjPreviousPoint, advancedLjNextPoint, advancedLjRangeIncrement,
  advanceLjCursor, advanceLjDragLayer } from '../../../../core/config/constants/advanced-lj.const';
  import { LjChartEventType, LjChartMode, LjChartXAxisType } from '../../../../contracts/enums/advanced-lj/lj-chart.enum';
  import { LevelStatistics, StatisticsResult } from '../../../../contracts/models/data-management/advanced-lj/lj-statistics.model';
  import { StatisticsTypeEnum } from '../../../../contracts/enums/advanced-lj/lj-statistics.enum';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

declare var Plotly: any;

@Component({
  selector: 'unext-advanced-lj-chart',
  templateUrl: './advanced-lj-chart.component.html',
  styleUrls: ['./advanced-lj-chart.component.scss']
})
export class AdvancedLjChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ljChart: LjChart;
  @Input() comparisonStatistics : StatisticsResult;
  @Input() comparison: StatisticsTypeEnum;
  @Input() xAxisOption : LjChartXAxisType;
  @Input() jasmineTest: boolean = false;
  @Output() plotlyPng = new EventEmitter<any>();

  private readonly plotlyDiv = 'myPlotlyDiv';
  private resizeObserver: ResizeObserver;
  private hasChartResizedInitially = false;
  private comparisonOptions = StatisticsTypeEnum;

  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    // Make Plotly chart responsive.
    this.resizeObserver = new ResizeObserver(() => {
      if (this.hasChartResizedInitially) {
        Plotly.relayout(this.plotlyDiv, {});
      } else {
        this.hasChartResizedInitially = true;
      }
    });

    this.resizeObserver.observe(document.getElementById(this.plotlyDiv));
  }

  ngOnChanges() {
    this.processLjChartData();
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(document.getElementById(this.plotlyDiv));
    }
  }

  processLjChartData() {
    // setup Plotly specific information
    let plotlyData = this.getFormattedPlotlyData(this.ljChart);
    let plotlyLayout = this.getFormattedPlotlyLayout(this.ljChart);

    // Display plotly graph
    this.generatePlotlyGraph(this.plotlyDiv, plotlyData, plotlyLayout, {
      modeBarButtonsToRemove: advancedLjPlotlyButtonsToRemove,
      displaylogo: false
    }).then((plot) => {
      // Change Mouse cursor when hover on datapoints
      let dragLayer = Plotly.dragLayer;
      dragLayer = document.querySelector(advanceLjDragLayer);
      plot.on('plotly_hover', function () {
        dragLayer.style.cursor = advanceLjCursor
      });
      plot.on('plotly_unhover', function () {
        dragLayer.style.cursor = ''
      });
      let imageWidth = document.getElementById(this.plotlyDiv).clientWidth;
      let scaleFactor = 1;
      if (imageWidth > advancedLjMaxExportWidth) {
        scaleFactor = advancedLjMaxExportWidth / imageWidth;
        imageWidth = advancedLjMaxExportWidth;
      }

      let imageHeight = plotlyLayout.height * scaleFactor;
      Plotly.toImage(this.plotlyDiv, { format: 'png', width: imageWidth, height: imageHeight }).then((val: string) => {
        this.plotlyPng.emit({
          src: val,
          width: imageWidth,
          height: imageHeight
        });
      });
    }).catch(() => {
      // Only here for unit test reasons to handle null return
    });
  }

  public getFormattedPlotlyData(incomingLjChart: LjChart): any {
    var builtData = [];

    if (incomingLjChart && incomingLjChart.data) {
      // Level data plot
      let dataSize = (incomingLjChart.data.filter(data => data instanceof LjChartDataLevel)).length;

      incomingLjChart.data.filter(data => data instanceof LjChartDataLevel).forEach((chartDataLevel: LjChartDataLevel, index) => {
        let dataEntryTemplate = {
          x: chartDataLevel.x,
          y: chartDataLevel.y,
          mode: this.xAxisOption === LjChartXAxisType.Date ? advancedLjPlotlyModeMarkers : advancedLjPlotlyModeLinesAndMarkers,
          type: advancedLjPlotlyTypeScatter,
          showLine: chartDataLevel.showLine,
          hovertemplate: '%{text}' + '<extra></extra>', // EXTRA EXTRA required to not display 'trace'
          text: chartDataLevel.text, // will dipslay hover temlpate text synced with x, y
          line: {
            color: chartDataLevel.lineColor,
            width: advancedLjLineSize
          },
          marker: {
            size: advancedLjPointSize
          },
          xaxis: chartDataLevel.xAxisName,
          yaxis: chartDataLevel.yAxisName
        };

        if (incomingLjChart.config.secondaryYAxis && incomingLjChart.config.secondaryYAxis.length > index) {
          let dataEntryTemplate = {
            x: [chartDataLevel.x[0]],
            y: [0],
            mode: advancedLjPlotlyModeMarkers,
            type: advancedLjPlotlyTypeScatter,
            showLine: false,
            marker: {
              color: advancedLjSecondaryYAxisMarkerColor,
              size: advancedLjSecondaryYAxisMarkerSize
            },
            font: {
              family: advancedLjPlotEventAnnotationFontFamily,
              size: advancedLjPlotEventAnnotationFontSize,
            },
            xaxis: chartDataLevel.xAxisName,
            yaxis: `${yAxisPrefix}${dataSize + index + advancedLjSecondaryYAxisIncrementValue}`,
            hoverinfo: advancedLjSkipHover
          };
          builtData.push(dataEntryTemplate);
        }
        builtData.push(dataEntryTemplate);
      });

      // Special points to be added to plot (Warning, Reject, Not Accepted)
      incomingLjChart.data.filter(data => data instanceof LjChartDataItem).forEach((chartDataItem: LjChartDataItem) => {
        let dataEntryTemplate = {
          x: chartDataItem.x,
          y: chartDataItem.y,
          mode: advancedLjPlotlyModeMarkers,
          type: advancedLjPlotlyTypeScatter,
          showLine: false,
          text: chartDataItem.text,
          marker: {
            color: chartDataItem.marker.color,
            symbol: chartDataItem.marker.symbol,
            size: chartDataItem.marker.size
          },
          xaxis: chartDataItem.xAxisName,
          yaxis: chartDataItem.yAxisName,
          hoverinfo: advancedLjSkipHover
        };

        builtData.push(dataEntryTemplate);
      });
    }
    return builtData;
  }

    public getFormattedPlotlyLayout(ljPlotly: LjChart): any {
      let currPlotlyConfig = ljPlotly.config;
      let newLayout = {};
      let plotCount = currPlotlyConfig && currPlotlyConfig.xAxis ? currPlotlyConfig.xAxis.length : 0;
      let currAnnotations = [];
      let layoutShapes = [];
      const meanTranslated = this.getTranslation('TRANSLATION.MEAN');

      if (plotCount > 0) {
        // Setup first section of layout
        newLayout = {
          height: (plotCount > 2) ? plotCount * advancedLjPlotHeightPerChart : advancedLjPlotHeightTwoCharts,
          grid: {
            rows: plotCount,
            columns: 1,
            pattern: advancedLjPlotlyGridPatternIndependent,
            rowOrder: advancedLjPlotlyGridRowOrderBottomToTop
          },
          showlegend: false,
          annotations: currAnnotations,
          hoverlabel: {
            bgcolor: AdvancedLjConst.advancedLjBgColor,
            align: AdvancedLjConst.advancedLjAlignLeft,
            font: {
              family: 'lato',
              size: 14.6,
            }
          },
          autosize: true,
          margin: {
            pad : 2
          }
        };

      layoutShapes = newLayout[advancedLjShapesProperty] = [];

      for (let i = 0; i < plotCount; i++){
        let letAxisNumber = i > 0 ? (i + 1).toString() : '';
        let xAxisName = advancedLjPlotlyXaxisName + letAxisNumber.toString();
        let yAxisName = advancedLjPlotlyYaxisName + letAxisNumber.toString();
        let xAxisConfig = currPlotlyConfig.xAxis[i];
        let yAxisConfig = currPlotlyConfig.yAxis[i];
        const xAxisText = [];
        xAxisConfig.categoryArray.forEach((item) => { xAxisText.push(item.trim()); });

        newLayout[xAxisName] = {
          type: advancedLjPlotlyAxisTypeCategory,
          categoryorder: advancedLjCategoryOrder,
          categoryarray: xAxisConfig.categoryArray,
          tickmode: AdvancedLjConst.tickMode,
          tickvals: xAxisConfig.categoryArray,
          ticktext: xAxisText
        };

        if (xAxisConfig.matches) {
          newLayout[xAxisName].matches = xAxisConfig.matches;
        }

        if (xAxisConfig.range && xAxisConfig.range.length === 2) {
          // when range[0], range[1] are equal, plotly plots previous point even if it's not in range.
          // when range[0], range[1] are equal but not [0, 0], make it [x, x - 1 + .1] so that only points in range are plotted
          // when range[0], range[1] are equal but [0, 0], make it [x, x + .9] so that only points in range are plotted
          // advancedLjRangeIncrement is used to provide proper spacing before first point and the last point visible on graph
          let modifiedRange = [xAxisConfig.range[0], xAxisConfig.range[1]]
          if (xAxisConfig.range[0] !== xAxisConfig.range[1]) {
            modifiedRange[0] = Number(xAxisConfig.range[0]) - advancedLjRangeIncrement;
            modifiedRange[1] = Number(xAxisConfig.range[1]) + advancedLjRangeIncrement;
          }
          if (xAxisConfig.range[0] === xAxisConfig.range[1] && xAxisConfig.range[0] !== 0) {
            modifiedRange[0] = Number(xAxisConfig.range[0]) - 1 + advancedLjPreviousPoint;
            modifiedRange[1] = Number(xAxisConfig.range[1]) + advancedLjRangeIncrement;
          } else if (xAxisConfig.range[0] === xAxisConfig.range[1] && xAxisConfig.range[0] === 0) {
            modifiedRange[0] = Number(xAxisConfig.range[0]) - advancedLjRangeIncrement;
            modifiedRange[1] = Number(xAxisConfig.range[1]) + advancedLjNextPoint;
          }
          newLayout[xAxisName].range = modifiedRange;
        }

        newLayout[yAxisName] = {
          domain: this.getAxisDomain(plotCount - 1 - i, plotCount),
          zeroline: false,
          tickvals: yAxisConfig.byZscore ? [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5] : undefined,
          ticktext: yAxisConfig.byZscore ? [-5,-4,-3,-2,-1,meanTranslated,+1,+2,+3,+4,+5] : undefined
        };

          if (currPlotlyConfig.secondaryYAxis && currPlotlyConfig.secondaryYAxis.length > i) {
            newLayout[advancedLjPlotlyYaxisName + (plotCount + i + advancedLjSecondaryYAxisIncrementValue)] = {
              range: currPlotlyConfig.secondaryYAxis[i].range,
              tickvals: currPlotlyConfig.secondaryYAxis[i].tickvals.length > 0 ? currPlotlyConfig.secondaryYAxis[i].tickvals : [] ,
              ticktext: undefined,
              titlefont: { color: currPlotlyConfig.secondaryYAxis[i].titlefont.color },
              tickfont: { color: currPlotlyConfig.secondaryYAxis[i].tickfont.color },
              overlaying: currPlotlyConfig.secondaryYAxis[i].overlaying,
              side: currPlotlyConfig.secondaryYAxis[i].side,
              showgrid: currPlotlyConfig.secondaryYAxis[i].showgrid,
              zeroline: false
            }
          }

        if (yAxisConfig.range && yAxisConfig.range.length === 2) {
          newLayout[yAxisName].range = yAxisConfig.range;
        }

        // Title and subAnnotation for each plotly level
        if (xAxisConfig.showTitle) {
          let subTitleLevel = this.getSubplotTitle(xAxisConfig.levels, xAxisConfig.isFixedMean, xAxisConfig.isFixedSd);

          let currXref = 'x domain';
          let currYref = 'y domain';

          if (letAxisNumber != '') {
            currXref = 'x' + letAxisNumber + ' domain';
            currYref = 'y' + letAxisNumber + ' domain';
          }

          let subAnnotation = {
            text: subTitleLevel,
            showarrow: false,
            x: 0,
            xref: currXref,
            y: 1.2,
            yref: currYref,
            font: {
              size: 16
              }
            }
            currAnnotations.push(subAnnotation);

            if ((this.ljChart.mode == LjChartMode.Value || this.ljChart.mode == LjChartMode.Date) &&
               (this.comparison === this.comparisonOptions.PeerMeanSD || this.comparison === this.comparisonOptions.MethodMeanSD)) {
              if (this.comparisonStatistics && this.comparisonStatistics.levelStatistics.length > 0 && xAxisConfig.levels.length > 0) {
                let instrumentData : LevelStatistics[] = [];
                instrumentData = this.comparisonStatistics.levelStatistics.filter(sData => sData.level === xAxisConfig.levels[0]);
                if (instrumentData && instrumentData.length > 0) {
                  const instruments = this.getTranslation('ADVANCEDLJCHART.INSTRUMENTS');
                  const dataTypePeer = this.getTranslation('ADVANCEDLJCHART.PEER');
                  const dataTypeMethod = this.getTranslation('ADVANCEDLJCHART.METHOD');
                  const numberOfInstruments = instrumentData[0].numberOfInstruments.toString();
                  let dataTypeText = this.comparison === this.comparisonOptions.PeerMeanSD ? dataTypePeer : dataTypeMethod;
                  let instrumentInfo = `${dataTypeText}  ${numberOfInstruments} ${instruments}`;
                  let subAnnotation2 = {
                    text: instrumentInfo,
                    showarrow: false,
                    x: 1,
                    xref: currXref,
                    y: 1.2,
                    yref: currYref,
                    bgcolor: advancedLjSecondaryAxisItemColor,
                    borderpad: 3,
                    font: {
                      size: advancedLjInstrumentCountFont,
                      color: advancedLjInstrumentCountColor
                    }
                  }
                  currAnnotations.push(subAnnotation2);
                }
              }
            }

          }

        // Placement of shapes (lines and rectanges - mean lines and SD regions)
        let currPlotlyConfigShapes = currPlotlyConfig.shapes;
        if (currPlotlyConfigShapes.length > 0) {
          currPlotlyConfigShapes
            .forEach((shape: LjChartShape) => {
              layoutShapes.push({
                type: shape.type,
                xref: shape.xAxisName,
                yref: shape.yAxisName,
                x0: shape.x0,
                y0: shape.y0,
                x1: shape.x1,
                y1: shape.y1,
                layer: shape.layer,
                line: {
                  color: shape.color,
                  width: shape.line ? shape.line.width : advancedLjMeanLineSize,
                  dash: shape.line ? shape.line.dash : advancedLjDashMeanShapeSolid
                },
                fillcolor: shape.color,
                opacity: .75,
              });
            });
        }

        ljPlotly.data.filter(data => data instanceof LjChartDataLevel).forEach((chartDataLevel: LjChartDataLevel) => {
          if (currPlotlyConfig.chartEvents) {
            currPlotlyConfig.chartEvents.forEach(cE => {
              if (cE.controlLevel === chartDataLevel.level) {
                let tempShape = {
                  type: AdvancedLjConst.advancedLjPlotEventAnnotationPoleShapeType,
                  xref: chartDataLevel.xAxisName,
                  yref: chartDataLevel.yAxisName,
                  x0: chartDataLevel.x[cE.targetXIndex],
                  y0: AdvancedLjConst.advancedLjPlotEventAnnotationPoleHeightTop,
                  x1: chartDataLevel.x[cE.targetXIndex],
                  y1: AdvancedLjConst.advancedLjPlotEventAnnotationPoleHeightBottom,
                  fillcolor: AdvancedLjConst.advancedLjPlotEventAnnotationPoleColor,
                  line: {
                    color: AdvancedLjConst.advancedLjPlotEventAnnotationPoleColor,
                    width: AdvancedLjConst.advancedLjPlotEventAnnotationPoleWidth
                  },
                  opacity: AdvancedLjConst.advancedLjPlotEventAnnotationOpacity,
                  layer: AdvancedLjConst.advancedLjPlotEventAnnotationPoleLayer,
                  ysizemode: AdvancedLjConst.advancedLjPlotEventAnnotationPoleHeightIncrement
                }
                layoutShapes.push(
                  tempShape
                );

                let eventText = this.eventTranslation(cE);

                let currEventAnnotation = {
                  x: chartDataLevel.x[cE.targetXIndex],
                  y: cE.yValue,
                  xref: chartDataLevel.xAxisName,
                  yref: chartDataLevel.yAxisName,
                  xshift: cE.xShift,
                  yshift: cE.yShift,
                  height: AdvancedLjConst.advancedLjPlotEventAnnotationHeight,
                  text: eventText,
                  showarrow: false,
                  font: {
                    family: AdvancedLjConst.advancedLjPlotEventAnnotationFontFamily,
                    size: AdvancedLjConst.advancedLjPlotEventAnnotationFontSize,
                    color: cE.color
                  },
                  bold: AdvancedLjConst.advancedLjPlotEventAnnotationFontBold,
                  align: AdvancedLjConst.advancedLjPlotEventAnnotationTextAlign,
                  bordercolor: AdvancedLjConst.advancedLjPlotEventAnnotationBorderColor,
                  borderwidth: AdvancedLjConst.advancedLjPlotEventAnnotationBorderWidth,
                  borderpad: AdvancedLjConst.advancedLjPlotEventAnnotationBorderPad,
                  bgcolor: cE.bgColor,
                  opacity: AdvancedLjConst.advancedLjPlotEventAnnotationOpacity,
                  type: cE.eventType,
                  hovertext: eventText
                };

                currAnnotations.push(currEventAnnotation);
              }
            });
          }
        });
      }
    }
    newLayout[advancedLjDragModeProperty] = advancedLjDragModeValue;

    return newLayout;
  }

  public generatePlotlyGraph(targetElement: string, plotlyData: any, plotlyLayout: any, plotlyConfig: any): any {
    return Plotly.newPlot(targetElement, plotlyData, plotlyLayout, plotlyConfig);
  }

  // Get y-axis domain two-item array that determines height percentage and spacing of subplots
  private getAxisDomain(i: number, totalSubplots: number): Array<number> {
    const subplotSpacing = totalSubplots < advancedLjDynamicSpacingSubplotLimit
      ? totalSubplots * advancedLjAdjustmentFactor
      : advancedLjStaticSubplotSpacing;
    const spacingPerFace = subplotSpacing / ((totalSubplots - 1) * 2);
    const expectedDomain = (1 - subplotSpacing) / totalSubplots;

    const previousDomainLocked = expectedDomain * i;
    const previousSpaceLocked = spacingPerFace * (i * 2 - 1);
    const endValue = previousDomainLocked + previousSpaceLocked + expectedDomain + spacingPerFace;

    return [
      i === 0 ? 0 : previousDomainLocked + previousSpaceLocked + spacingPerFace,
      i === totalSubplots - 1 ? 1 : endValue,
    ];
  }

  private eventTranslation(ljChartEvent: LjChartEvent): string {
    let translatedEventText = ljChartEvent.text;
    let fixedMeanTranslation = this.getTranslation('TRANSLATION.FIXEDMEAN');
    let fixedSdTranslation = this.getTranslation('TRANSLATION.FIXED');
    let floatingMeanTranslation = this.getTranslation('TRANSLATION.FLOATING');
    let floatingSdTranslation = this.getTranslation('TRANSLATION.FLOATINGSD');
    if (ljChartEvent.eventType == LjChartEventType.MeanChange || ljChartEvent.eventType == LjChartEventType.SdChange) {
      return translatedEventText.replace('{evalfixedmean}', fixedMeanTranslation).replace('{evalfloatmean}', floatingMeanTranslation).replace('{evalfixedsd}', fixedSdTranslation).replace('{evalfloatsd}', floatingSdTranslation);
    }
    return translatedEventText;
  }

  private getSubplotTitle(levels: Array<number>, isFixedMean: boolean, isFixedSd: boolean): string {
    let title = "";
    const LEVEL_NUMBER_STRING = '[LEVEL_NUMBER]'

    if (levels && levels.length > 0) {
      // If overlay
      if (levels.length > 1) {
        const levelsTranslate = this.getTranslation('TRANSLATION.LEVELS');
        const andTranslate = this.getTranslation('TRANSLATION.AND')
        switch (levels.length) {
          case 2:
            title = `${levelsTranslate} ${LEVEL_NUMBER_STRING} ${andTranslate} ${LEVEL_NUMBER_STRING}`;
            break;
          case 3:
            title = `${levelsTranslate} ${LEVEL_NUMBER_STRING}, ${LEVEL_NUMBER_STRING} ${andTranslate} ${LEVEL_NUMBER_STRING}`
            break;
          case 4:
            title = `${levelsTranslate} ${(LEVEL_NUMBER_STRING+', ').repeat(2)}${LEVEL_NUMBER_STRING} ${andTranslate} ${LEVEL_NUMBER_STRING}`
            break;
          case 5:
            title = `${levelsTranslate} ${(LEVEL_NUMBER_STRING+', ').repeat(3)}${LEVEL_NUMBER_STRING} ${andTranslate} ${LEVEL_NUMBER_STRING}`
            break;
          case 6:
            title = `${levelsTranslate} ${(LEVEL_NUMBER_STRING+', ').repeat(4)}${LEVEL_NUMBER_STRING} ${andTranslate} ${LEVEL_NUMBER_STRING}`
            break;
          case 7:
            title = `${levelsTranslate} ${(LEVEL_NUMBER_STRING + ', ').repeat(5)}${LEVEL_NUMBER_STRING} ${andTranslate} ${LEVEL_NUMBER_STRING}`
            break;
          case 8:
            title = `${levelsTranslate} ${(LEVEL_NUMBER_STRING + ', ').repeat(6)}${LEVEL_NUMBER_STRING} ${andTranslate} ${LEVEL_NUMBER_STRING}`
            break;
          case 9:
            title = `${levelsTranslate} ${(LEVEL_NUMBER_STRING + ', ').repeat(7)}${LEVEL_NUMBER_STRING} ${andTranslate} ${LEVEL_NUMBER_STRING}`
            break;
        }
      } else {
        const levelTranslate = this.getTranslation('TRANSLATION.LEVEL');
        const fixed = this.getTranslation('TRANSLATION.FIXED');
        const fixedMean = this.getTranslation('TRANSLATION.FIXEDMEAN');
        const floating = this.getTranslation('TRANSLATION.FLOATING');
        const floatingSd = this.getTranslation('TRANSLATION.FLOATINGSD');
        if (isFixedMean) {
          if (isFixedSd) {
            title = `${levelTranslate} ${LEVEL_NUMBER_STRING}, ${fixedMean}, ${fixed}`
          } else {
            title = `${levelTranslate} ${LEVEL_NUMBER_STRING}, ${fixedMean}, ${floatingSd}`
          }
        } else {
          if (isFixedSd) {
            title = `${levelTranslate} ${LEVEL_NUMBER_STRING}, ${floating}, ${fixed}`
          } else {
            title = `${levelTranslate} ${LEVEL_NUMBER_STRING}, ${floating}, ${floatingSd}`
          }
        }
      }

        levels.forEach(level => {
          title = title.replace(LEVEL_NUMBER_STRING, level.toString());
        });
      }
      return title;
    }

  getTranslation(translationCode: string): string {
    let translatedContent:string;
    this.translateService.get(translationCode).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
