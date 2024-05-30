// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';

import 'moment-timezone';
import { format, scale, select, svg, time } from 'd3';
import { selectAll } from 'd3-selection';
import * as moment from 'moment';
import * as fromRoot from '../../../../../state/app.state';
import * as dataManagementActions from '../../../state/actions/data-management.actions';

import { LjChartPopupService } from './lj-chart-popup/lj-chart-popup.service';
import { LJChartConfig } from './lj-chart.config';
import { RunsResult, Level, ZScoreResult, ResultStatus } from '../../../../../contracts/models/data-management/runs-result.model';
import { LocalizationService } from '../../../../../shared/navigation/services/localizaton.service';


export class LJChart {
  target: HTMLElement;
  levels = [];
  runsId: number[] = [];
  color = 0;
  xDates: Date[] = [];
  val = 0;
  _LjChartPopupService: LjChartPopupService;
  runsCount = 0;
  labTimeZone = '';
  // Set the ranges
  x = time.scale().range([0, LJChartConfig.width]);
  y = scale.linear().range([LJChartConfig.height, 0]);
  levelsInUse: Array<number>;

  constructor(
    target: HTMLElement,
    _LjChartPopupService: LjChartPopupService,
    private localizationService: LocalizationService,
    private store: ngrxStore.Store<fromRoot.State>
  ) {
    this.target = target;
    this._LjChartPopupService = _LjChartPopupService;
  }

  render(data: RunsResult) {
    this.runsCount = data.runs.length;
    this.labTimeZone = data.labTimeZone;
    this.xDates = [];
    this.levels = [];
    this.runsId = [];
    this.color = 0;
    this.val = 0;
    const that = this;
    select('svg svg').remove();
    this.parseData(data);
    this.runsId = this.runsId.sort();
    const label = select('.label');
    const xAxis = this.getXAxis();
    const yAxis = this.getYAxis();
    const svgElement = this.getTargetElement();
    this.y.domain([-3, 3]);
    this.configureChart(svgElement, yAxis, label);

    this.addChartBackgroundBoxes(svgElement);
    this.addChartBackgroundLines(svgElement);
    this.drawLines(svgElement, label);
    this.drawCrosses(svgElement, label);
  }

  parseData(data: RunsResult) {
    // validate levels (4 max per run)
    let maxLevels = 0;
    this.xDates = [];
    const runDate = '';

    let previousRunDateTime = null;
    let offset = 1;

    //  Loop through each run's levels
    data.runs.forEach(c => {
      //  get runs date (for reference on slicing a hilight)
      const date: any = moment(c.runDateTime);
      const newDate: Date = moment(
        date.tz(this.labTimeZone).format('MMMM DD YYYY h:mm:ss a')
      ).toDate();

      if (
        previousRunDateTime != null &&
        previousRunDateTime.getTime() === newDate.getTime()
      ) {
        previousRunDateTime = new Date(newDate);
        newDate.setSeconds(newDate.getSeconds() - offset);
        offset += 1;
      } else {
        previousRunDateTime = new Date(newDate);
        offset = 1;
      }

      this.xDates.push(c.runDateTime);

      c.levels.forEach(d => {
        if (d != null) {
          // limit the levels to 4  removed AJT bug fix 218707 11/4/2021 allow up to 10 levels
          if (maxLevels <= 10 && this.levelsInUse.includes(d.level)) {
            if (!this.runsId.includes(d.level)) {
              this.runsId.push(d.level);
            }

            if (d.zScoreResult != null && d.zScoreResult.zScore != null) {
              this.val = d.zScoreResult.zScore;
              //  if ZScore exceeded -3/+3 then add val to exceed
              if (d.zScoreResult.zScore > 3) {
                this.val = 3.17;
              } else if (d.zScoreResult.zScore < -3) {
                this.val = -3.17;
              }
            }

            let stats: String = '';
            if (d.resultStatus === ResultStatus.Reject) {
              stats = 'Reject';
            }
            if (d.resultStatus === ResultStatus.Accept) {
              stats = 'Accept';
            }
            if (d.resultStatus === ResultStatus.None) {
              stats = '';
            }
            if (d.resultStatus === ResultStatus.Warning) {
              stats = 'Warning';
            }

            // populate levels ary
            this.levels.push({
              score: d.zScoreResult.zScore,
              val: this.val,
              value: d.value,
              date: newDate, // get date from runs
              level: d.level,
              stats: stats,
              cv: d.cv,
              sd: d.sd,
              mean: d.mean,
              reasons: d.reasons,
              measuredDateTime: c.runDateTime,
              resultStatus: d.resultStatus,
              isAccepted: d.isAccepted
            });
          }
          // get up to (4) levels per run removed AJT bug fix 218707 11/4/2021 allow up to 10 levels
          maxLevels++;

        }
      });

      maxLevels = 0;
    });
  }

  getXAxis() {
    return svg
      .axis()
      .scale(this.x)
      .orient('bottom')
      .tickFormat(time.format('%b %d'));
  }

  getYAxis() {
    const formatter = format('0,.1f');
    return svg
      .axis()
      .scale(this.y)
      .orient('left')
      .ticks(6)
      .tickFormat(format(',.1f'));
  }

  getTargetElement() {
    return select(this.target)
      .append('svg')
      .append('g')
      .attr({
        width:
          LJChartConfig.width +
          LJChartConfig.margin.left +
          LJChartConfig.margin.right,
        height:
          LJChartConfig.height +
          LJChartConfig.margin.top +
          LJChartConfig.margin.bottom,
        transform:
          'translate(' +
          LJChartConfig.margin.left +
          ',' +
          LJChartConfig.margin.top +
          ')'
      });
  }

  groupDataPointsByLevels() {
    const paths = [];
    let ary = new Array();
    let indx = 0;
    this.runsId.forEach((level, lvIdx) => {
      this.levels.forEach(i => {
        if (i.level === level) {
          ary[indx] = i;
          indx++;
        }
      });

      ary.sort(function (d, a) {
        return d.date - a.date;
      });
      paths[lvIdx] = ary;
      indx = 0;
      ary = [];
    });

    return paths;
  }

  configureChart(svgElement: any, yAxis: any, label: any) {
    this.levels.sort(function (a, d) {
      return a.date - d.date;
    });

    const vals = this.levels.map(function (d) {
      return d.date;
    });

    this.x = scale
      .ordinal()
      .domain(vals)
      .rangePoints([0, LJChartConfig.width]);

    const xAxis = svg
      .axis()
      .scale(this.x)
      .orient('bottom')
      .tickValues(vals)
      .outerTickSize(5)
      .tickFormat(time.format(this.returnsFormatBasedonLocale()))
      .tickPadding(15)
      .innerTickSize(-LJChartConfig.height);
    this.appendxyAxis(svgElement, xAxis, yAxis);
  }

  addChartBackgroundBoxes(svgElement) {
    // add bg 3 shaded boxes
    // h: y: clr
    const boxes: any = [
      [LJChartConfig.height, 0, LJChartConfig.chartColors.chartBGGrey],
      [
        LJChartConfig.height - LJChartConfig.height / 3,
        LJChartConfig.height / 6,
        LJChartConfig.chartColors.chartBGLightGrey
      ],
      [
        LJChartConfig.height / 3,
        LJChartConfig.height / 3,
        LJChartConfig.chartColors.chartBGwhite
      ]
    ];

    for (let indx = 0; indx < boxes.length; indx++) {
      svgElement
        .append('defs')
        .append('linearGradient')
        .attr('id', 'bgColor' + indx)
        .append('stop')
        .attr({
          offset: '100%',
          'stop-color': boxes[indx][2]
        });

      svgElement
        .append('rect')
        .attr({
          width: LJChartConfig.width,
          height: boxes[indx][0],
          y: boxes[indx][1]
        })
        .style('fill', 'url(#bgColor' + indx + ')');
    }
  }

  addChartBackgroundLines(svgElement) {
    // Middle horizontal lines
    const middleLines = [6, 3, 2, 3, 6]; // chart height % indexes
    for (let i = 0; i < middleLines.length; i++) {
      let calc = 0;
      calc = LJChartConfig.height / middleLines[i];
      if (i > 2) {
        // calc bottom 2 lines
        calc = LJChartConfig.height - LJChartConfig.height / middleLines[i];
      }
      const attrs = {
        x1: 0,
        y1: calc,
        x2: LJChartConfig.width,
        y2: calc
      };
      svgElement
        .append('line')
        .attr(attrs)
        .style('stroke', '#cccccc');
    }
  }

  appendxyAxis(svgElement, xAxis, yAxis) {
    let cls = '';
    if (this.runsCount >= 3) {
      cls = 'xaxisDates';
    } else {
      cls = 'xaxis';
    }

    svgElement
      .append('g')
      .attr('class', 'x axis')
      .attr('id', cls)
      .attr('transform', 'translate(0,' + LJChartConfig.height + ')')
      .call(xAxis);
    svgElement
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis);
  }

  drawLines(svgElement: any, label: any) {
    const that = this;
    const paths = this.groupDataPointsByLevels();
    const ref = this;

    // draw lines
    for (let run = 0; run < this.runsId.length; run++) {
      const color = LJChartConfig.colorIndx[this.runsId[run] - 1];
      const itm = paths[run];

      for (let i = 0; i < itm.length; i++) {
        // draw the line
        const valueline = svg
          .line()
          .interpolate('linear')
          .x(d => {
            return this.x(d.date);
          })
          .y(d => {
            if (d.score > LJChartConfig.chartMaxHighVal) {
              return this.y(LJChartConfig.chartMaxHighVal);
            }
            if (d.score < LJChartConfig.chartMaxLowVal) {
              return this.y(LJChartConfig.chartMaxLowVal);
            }
            return this.y(d.val);
          });

        const pathid = this.runsId[run];

        if (itm[i].level === this.runsId[run]) {
          const attrs: any = {
            d: valueline(itm),
            id: 'line' + pathid,
            'stroke-width': '1.2',
            stroke: color,
            class: 'showPath',
            fill: 'none'
          };

          const path = svgElement.append('path').attr(attrs);

          const dataDotPosition = this.calculateZScoreLocation(itm[i]);

          // Add the scatterplot
          const dataDot = svgElement
            .selectAll('path' + Math.round(Math.random() * 1000))
            .data(itm)
            .enter()
            .append('path')
            .attr({
              transform: d => {
                return (
                  'translate(' + this.x(d.date) + ',' + this.y(d.val) + ')'
                );
              },
              id: 'line' + pathid,
              d: d => this.getDataDotShapeByVal(d)
            })
            .attr('class', 'dataDot')
            .style('fill', d => this.dataDotPointStatusColor(d, color))
            .on('mouseover', function (point) {
              const levelInfo: Level = {
                zScoreResult: new ZScoreResult(),
                controlLotId: point.controlLotId,
                value: point.value,
                level: point.level,
                cv: point.cv,
                sd: point.sd,
                mean: point.mean,
                reasons: point.reasons,
                isAccepted: point.isAccepted,
                measuredDateTime: point.measuredDateTime,
                lastModified: point.lastModified,
                resultStatus: point.resultStatus
              };

              levelInfo.zScoreResult.zScore = point.score;
              that.store.dispatch(dataManagementActions.UpdatePopupInfo({ payload: levelInfo }));
              that._LjChartPopupService.show(
                that.x(point.date),
                that.y(point.score),
                point.score
              );
            })
            .on('mouseout', function (d) {
              that._LjChartPopupService.hide();
            });
        }
      }
    }
  }

  drawCrosses(svgElement: any, label: any) {
    const paths = this.groupDataPointsByLevels();
    for (let run = 0; run < this.runsId.length; run++) {
      const itm = paths[run];

      for (let i = 0; i < itm.length; i++) {
        const pathid = this.runsId[run];

        if (itm[i].level === this.runsId[run]) {
          if (!itm[i].isAccepted) {
            svgElement
              .selectAll('path' + Math.round(Math.random() * 1000))
              .data(itm)
              .enter()
              .append('text')
              .attr({
                transform: d => {
                  return (
                    'translate(' +
                    (this.x(d.date) - 5) +
                    ',' +
                    (this.y(d.val) + 5) +
                    ')'
                  );
                },
                id: 'cross' + pathid,
                class: 'cross'
              })
              .text(d => (d.isAccepted ? '' : 'X'));
          }
        }
      }
    }
  }

  dataDotPointStatusColor(d, color: string): string {
    const red = '#ff3333';
    const yellow = '#dbb14d';
    if (d.stats === 'Reject') {
      return red;
    }
    if (d.stats === 'Warning') {
      return yellow;
    }
    const dataDotPosition = this.calculateZScoreLocation(d);
    if (dataDotPosition === 1 || dataDotPosition === -1) {
      return red;
    }
    if (d.stats === '' || d.stats === 'Accept') {
      return color; // as is
    }
  }

  getDataDotShapeByVal(d) {
    const dataDotPosition = this.calculateZScoreLocation(d);

    if (dataDotPosition === 0) {
      return LJChartConfig.symbolTypes.circle();
    }
    if (dataDotPosition === 1) {
      return LJChartConfig.symbolTypes.triangleUp();
    }
    if (dataDotPosition === -1) {
      return LJChartConfig.symbolTypes.triangleDown();
    }
  }

  hilightSelectedDay(svgElement, slice) {
    let xDates: any[];
    xDates = this.xDates;
    const dateVal = new Date(slice.split('T')[0]);
    if (dateVal instanceof Date) {
      svgElement.selectAll('#redNeedle').remove(); // remove any existing red date lines (redNeedles)
      const parseDate = time.format('%Y-%m-%dT%X').parse;
      const xSc = scale
        .ordinal()
        .domain(xDates)
        .rangePoints([0, LJChartConfig.width]);
      // need to fix date format
      const xPosition = xSc(parseDate(slice));
      const attrs: any = {
        x1: xPosition,
        y1: 0,
        x2: xPosition,
        y2: LJChartConfig.height,
        id: 'redNeedle'
      };
      const styles = {
        'stroke-width': '2',
        stroke: '#ff4d4d'
      };
      svgElement
        .append('line')
        .attr(attrs)
        .style(styles);
    }
  }

  addDateRangeForVisibleRows(svgElement, startDate, endDate) {
    // 2 dates params defines the area space
    const e1 = new Date(startDate);
    const e2 = new Date(endDate);
    if (e1 instanceof Date && e2 instanceof Date) {
      const xSc = scale
        .ordinal()
        .domain(this.xDates)
        .rangePoints([0, LJChartConfig.width]);

      // 'give it a unique class name'
      const clsName = this.removeSpecialChart(e1.toString());

      // add highlight area
      const attributes: any = {
        x: xSc(e1),
        y: 0,
        width: d => xSc(e2) - xSc(e1),
        height: d => LJChartConfig.height,
        fill: LJChartConfig.chartColors.chartVisibleRowsHighlightColor,
        class: clsName,
        id: 'hilightArea',
        'fill-opacity': LJChartConfig.chartVisibleRowsHighlightOpacity
      };
      svgElement.append('rect').attr(attributes);
    }
  }

  removeSpecialChart(cls) {
    let clsName: string = cls.replace(/\s+/g, '-').toLowerCase();
    clsName = clsName.replace(/:/g, '');
    clsName = clsName.replace(')', '');
    clsName = clsName.replace('(', '');
    return clsName;
  }

  public updateDisplayLevels(levelIndexToggleState: Array<boolean>): void {
    for (let i = 0; i < this.levelsInUse.length; i++) {
      const level = this.levelsInUse[i];
      if (levelIndexToggleState && levelIndexToggleState[i]) {
        this.showLevel(level);
      } else {
        this.hideLevel(level);
      }
    }
  }

  private hideLevel(level: number): void {
    selectAll(`#line${level}`).style('visibility', 'hidden');
    selectAll(`#cross${level}`).style('visibility', 'hidden');
  }

  private showLevel(level: number): void {
    selectAll(`#line${level}`).style('visibility', 'visible');
    selectAll(`#cross${level}`).style('visibility', 'visible');
  }

  calculateZScoreLocation(d: any): number {
    let dataDotPosition = 0;
    const scoreVal = d.val;
    if (scoreVal > 3) {
      dataDotPosition = 1;
    } else if (scoreVal < -3) {
      dataDotPosition = -1;
    }
    return dataDotPosition;
  }
  returnsFormatBasedonLocale(): string {
    let format: string;
    let locale = this.localizationService.getLocaleDate().toString();
    const locales = this.localizationService.getLocaleLanguage().language;
    const localeValue = this.localizationService.getLocaleValue();
if (locale === '1' && localeValue === 'fr-CA') {
  return format = '%d-%m-%y';
} else {
  if (locale === '1' && (
    locales === 'hu' || locales === 'de' ||
    locales === 'ru' || locales === 'ko' ||
    locales === 'pl'
  )) {
    return format = '%d.%m.%y';
  } else {
    if (locale === '1') {
      return format = '%d/%m/%y';
    }
  }
}
if (locale === '0' && localeValue === 'fr-CA') {
  return format = '%m-%d-%y';
} else {
  if (locale === '0' && (
    locales === 'hu' || locales === 'de' ||
    locales === 'ru' || locales === 'ko' ||
    locales === 'pl'
  )) {
    return format = '%m.%d.%y';
  } else {
    if (locale === '0') {
      return format = '%m/%d/%y';
    }
  }
}
if (locale === '2' && localeValue === 'fr-CA') {
  return format = '%y-%m-%d';
} else {
  if (locale === '2' && (
    locales === 'hu' || locales === 'de' ||
    locales === 'ru' || locales === 'ko' ||
    locales === 'pl'
  )) {
    return format = '%y.%m.%d';
  } else {
    if (locale === '2') {
      return format = '%y/%m/%d';
    }
  }
}
}
}
