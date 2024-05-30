// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {svg, date, time } from 'd3';
import { levelColors } from '../../../../../core/config/constants/advanced-lj.const';

export class LJChartConfig {

  static colorIndx: string[] = [
    levelColors[0],
    levelColors[1],
    levelColors[2],
    levelColors[3],
    levelColors[4],
    levelColors[5],
    levelColors[6],
    levelColors[7],
    levelColors[8]
  ];
  static symbolTypes: { triangleDown: any, triangleUp: any, circle: any } = {
    triangleDown: svg.symbol().type('triangle-down').size(50),
    triangleUp: svg.symbol().type('triangle-up').size(50),
    circle: svg.symbol().type('circle').size(50)
  };
  static margin: { top: number, right: number, bottom: number, left: number } =
    {
      top: 30,
      right:  0,
      bottom: 30,
      left: 35
    };

    // initial chart width
  static width = 850;
  static height = 125;


  static parseDate: date = time.format('%Y-%m-%dT%X').parse;

  static chartColors = {
    dataDotWarningRed: '#F03E3D',
    chartBGGrey: '#E6E4E2',
    chartBGLightGrey: '#F6F4F2',
    chartBGwhite: '#ffffff',
    chartHorizontalLineColor: 'grey',
    chartVisibleRowsHighlightColor: '#f8a520',
  };

  static chartVisibleRowsHighlightOpacity = 0.2;

  static chartMaxHighVal = 3;
  static chartMaxLowVal = -3;

  static dataDotHoverSize = 100;
  static dataDotDeafultSize = 100;

}
