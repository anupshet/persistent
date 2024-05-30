/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';

import { LjChartDataItem, LjChartDataLevel, LjChartMarker } from '../../../../contracts/models/data-management/advanced-lj/lj-chart.models';
import { advancedLjCategoryOrder, advancedLjCrossSize, advancedLjCrossSymbol, advancedLjLineSize, advancedLjPlotHeightPerChart, advancedLjPlotlyAxisTypeCategory, advancedLjPlotlyGridPatternIndependent,
  advancedLjPlotlyGridRowOrderBottomToTop, advancedLjPlotlyModeLinesAndMarkers, advancedLjPlotlyModeMarkers, advancedLjPlotlyTypeScatter, advancedLjPointSize,
  advancedLjSkipHover, advancedLjSpecialPointColorReject, levelColors, tickMode } from '../../../../core/config/constants/advanced-lj.const';
import { AdvancedLjChartComponent } from './advanced-lj-chart.component';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpLoaderFactory } from '../../../../app.module';

describe('advancedLjChartComponent', () => {
  let component: AdvancedLjChartComponent;
  let fixture: ComponentFixture<AdvancedLjChartComponent>;

  let ljChartData1 = new LjChartDataLevel();
  ljChartData1.x = [
    "Jun 02",
    "Jun 02 ",
    " Jun 02 ",
    " Jun 02  ",
    "Jun 21",
    "Jun 21 ",
    " Jun 21 ",
    " Jun 21  ",
    "Jun 23",
    "Jun 23 ",
    " Jun 23 ",
    " Jun 23  ",
    "  Jun 23  "
  ];
  ljChartData1.y = [
    2.2,
    1.2,
    1.1,
    5.5,
    2,
    7,
    3,
    2,
    3,
    4,
    2,
    3,
    4
  ];
  ljChartData1.showLine = true;
  ljChartData1.lineColor = levelColors[0];
  ljChartData1.xAxisName = 'x1';
  ljChartData1.yAxisName = 'y1';
  ljChartData1.text = [];
  ljChartData1.hovertemplate = '%{text}<extra></extra>';

  let ljChartData2 = new LjChartDataLevel();
  ljChartData2.x = [
    "Jun 02",
    "Jun 02 ",
    " Jun 02 ",
    " Jun 02  ",
    "Jun 21",
    "Jun 21 ",
    " Jun 21 ",
    " Jun 21  ",
    "Jun 23",
    "Jun 23 ",
    " Jun 23 ",
    " Jun 23  ",
    "  Jun 23  "
  ];
  ljChartData2.y = [
    3.3,
    2.3,
    2.2,
    4.4,
    2,
    7,
    3,
    2,
    3,
    4,
    2,
    3,
    4
  ];
  ljChartData2.showLine = true;
  ljChartData2.lineColor = levelColors[1];
  ljChartData2.xAxisName = 'x2';
  ljChartData2.yAxisName = 'y2';
  ljChartData2.text = [];
  ljChartData1.hovertemplate = '%{text}<extra></extra>';

  let ljChartData3 = new LjChartDataLevel();
  ljChartData3.x = [
    "Jun 02",
    "Jun 02 ",
    " Jun 02 ",
    " Jun 02  ",
    "Jun 21",
    "Jun 21 ",
    " Jun 21 ",
    " Jun 21  ",
    "Jun 23",
    "Jun 23 ",
    " Jun 23 ",
    " Jun 23  ",
    "  Jun 23  "
  ];
  ljChartData3.y = [
    4.4,
    3.4,
    3.3,
    3.3,
    2,
    7,
    3,
    2,
    3,
    4,
    2,
    3,
    4
  ];
  ljChartData3.showLine = true;
  ljChartData3.lineColor = levelColors[2];
  ljChartData3.xAxisName = 'x3';
  ljChartData3.yAxisName = 'y3';
  ljChartData3.text = [];
  ljChartData1.hovertemplate = '%{text}<extra></extra>';

  let ljChartItem = new LjChartDataItem();

  ljChartItem.x = [" Jun 02  ", "Jun 23"];
  ljChartItem.y = [5.5, 3];
  ljChartItem.text = [];
  ljChartData1.hovertemplate = '%{text}<extra></extra>';
  ljChartItem.marker = {
    color: advancedLjSpecialPointColorReject,
    size: advancedLjCrossSize,
    symbol: advancedLjCrossSymbol
  } as LjChartMarker;
  ljChartItem.xAxisName = 'x1';
  ljChartItem.yAxisName = 'y1';

  let ljChart1 = {
    "data": [
      ljChartData1,
      ljChartData2,
      ljChartData3,
      ljChartItem
    ],
    "config": {
        "xAxis": [
            {
                "matches": undefined,
                "range": [0,12],
                "byZscore": false,
                "categoryArray": [
                  "Jun 02",
                  "Jun 02 ",
                  " Jun 02 ",
                  " Jun 02  ",
                  "Jun 21",
                  "Jun 21 ",
                  " Jun 21 ",
                  " Jun 21  ",
                  "Jun 23",
                  "Jun 23 ",
                  " Jun 23 ",
                  " Jun 23  ",
                  "  Jun 23  "
                ],
                "showTitle": true,
                "levels": [1],
                "isFixedMean": true,
                "isFixedSd": true
            },
            {
                "matches": "x",
                "range": [0,12],
                "byZscore": false,
                "categoryArray": [
                  "Jun 02",
                  "Jun 02 ",
                  " Jun 02 ",
                  " Jun 02  ",
                  "Jun 21",
                  "Jun 21 ",
                  " Jun 21 ",
                  " Jun 21  ",
                  "Jun 23",
                  "Jun 23 ",
                  " Jun 23 ",
                  " Jun 23  ",
                  "  Jun 23  "
                ],
                "showTitle": true,
                "levels": [2],
                "isFixedMean": false,
                "isFixedSd": true
            },
            {
                "matches": "x",
                "range": [0,12],
                "byZscore": false,
                "categoryArray": [
                  "Jun 02",
                  "Jun 02 ",
                  " Jun 02 ",
                  " Jun 02  ",
                  "Jun 21",
                  "Jun 21 ",
                  " Jun 21 ",
                  " Jun 21  ",
                  "Jun 23",
                  "Jun 23 ",
                  " Jun 23 ",
                  " Jun 23  ",
                  "  Jun 23  "
                ],
                "showTitle": true,
                "levels": [3],
                "isFixedMean": false,
                "isFixedSd": false
            }
        ],
        "yAxis": [
            {
                "matches": undefined,
                "range": [0,12],
                "byZscore": false,
                "categoryArray": [],
                "showTitle": false,
                "levels": [1],
                "isFixedMean": true,
                "isFixedSd": false
            },
            {
                "matches": undefined,
                "range": [0,12],
                "byZscore": false,
                "categoryArray": [],
                "showTitle": false,
                "levels": [2],
                "isFixedMean": true,
                "isFixedSd": false
            },
            {
                "matches": undefined,
                "range": [0,12],
                "byZscore": false,
                "categoryArray": [],
                "showTitle": false,
                "levels": [3],
                "isFixedMean": true,
                "isFixedSd": false
            }
        ],
        "shapes": []
    },
    "mode": 1
  };

  let expectedPlotlyData = [
    {
      "x": ljChartData1.x,
      "y": ljChartData1.y,
      "mode": advancedLjPlotlyModeLinesAndMarkers,
      "type": advancedLjPlotlyTypeScatter,
      "showLine": true,
      "hovertemplate": '%{text}<extra></extra>',
      "text": [],
      "line": {
          "color": levelColors[0],
          "width": advancedLjLineSize
      },
      "marker": {
        "size": advancedLjPointSize
      },
      "xaxis": "x1",
      "yaxis": "y1"
    },
    {
      "x": ljChartData2.x,
      "y": ljChartData2.y,
      "mode": advancedLjPlotlyModeLinesAndMarkers,
      "type": advancedLjPlotlyTypeScatter,
      "showLine": true,
      "hovertemplate": '%{text}<extra></extra>',
      "text": [ ],
      "line": {
          "color": levelColors[1],
          "width": advancedLjLineSize
      },
      "marker": {
        "size": advancedLjPointSize
      },
      "xaxis": "x2",
      "yaxis": "y2"
    },
    {
      "x": ljChartData3.x,
      "y": ljChartData3.y,
      "mode": advancedLjPlotlyModeLinesAndMarkers,
      "type": advancedLjPlotlyTypeScatter,
      "showLine": true,
      "hovertemplate": '%{text}<extra></extra>',
      "text": [ ],
      "line": {
          "color": levelColors[2],
          "width": advancedLjLineSize
      },
      "marker": {
        "size": advancedLjPointSize
      },
      "xaxis": "x3",
      "yaxis": "y3"
    },
    {
      "x": ljChartItem.x,
      "y": ljChartItem.y,
      "mode": advancedLjPlotlyModeMarkers,
      "type": advancedLjPlotlyTypeScatter,
      "showLine": false,
      "text": [ ],
      "marker": ljChartItem.marker,
      "xaxis": ljChartItem.xAxisName,
      "yaxis": ljChartItem.yAxisName,
      "hoverinfo": advancedLjSkipHover
    }
];
  let expectedPlotlyLayout = {
    "height": advancedLjPlotHeightPerChart * 3,
    "grid": {
        "rows": 3,
        "columns": 1,
        "pattern": advancedLjPlotlyGridPatternIndependent,
        "rowOrder": advancedLjPlotlyGridRowOrderBottomToTop
    },
    "shapes":[],
    "hoverlabel":{ bgcolor: '#FFF', align: 'left',
      font: {
        family: 'lato',
        size: 14.6,
        }
    },
    "autosize": true,
    margin: {
      pad : 2
    },
    "showlegend": false,
    "annotations": [
        {
          "text":'Level 1, fixed mean, fixed SD',
          "showarrow": false,
          "x": 0,
          "xref": 'x domain',
          "y": 1.2,
          "yref": 'y domain',
          "font": {
            "size": 16
            }
        },
        {
          "text":'Level 2, floating mean, fixed SD',
          "showarrow": false,
          "x": 0,
          "xref": 'x2 domain',
          "y": 1.2,
          "yref": 'y2 domain',
          "font": {
            "size": 16
            }
        },
        {
          "text":'Level 3, floating mean, floating SD',
          "showarrow": false,
          "x": 0,
          "xref": 'x3 domain',
          "y": 1.2,
          "yref": 'y3 domain',
          "font": {
            "size": 16
          }
        }
      ],
    "xaxis": {
        "range": [
          -0.05,
           12.05
        ],
        "type": advancedLjPlotlyAxisTypeCategory,
        "categoryorder": advancedLjCategoryOrder,
        "categoryarray": [
          "Jun 02",
          "Jun 02 ",
          " Jun 02 ",
          " Jun 02  ",
          "Jun 21",
          "Jun 21 ",
          " Jun 21 ",
          " Jun 21  ",
          "Jun 23",
          "Jun 23 ",
          " Jun 23 ",
          " Jun 23  ",
          "  Jun 23  "
        ],
      "tickmode": tickMode,
      "tickvals": [
        "Jun 02",
        "Jun 02 ",
        " Jun 02 ",
        " Jun 02  ",
        "Jun 21",
        "Jun 21 ",
        " Jun 21 ",
        " Jun 21  ",
        "Jun 23",
        "Jun 23 ",
        " Jun 23 ",
        " Jun 23  ",
        "  Jun 23  "
      ],
      "ticktext": [
        "Jun 02",
        "Jun 02",
        "Jun 02",
        "Jun 02",
        "Jun 21",
        "Jun 21",
        "Jun 21",
        "Jun 21",
        "Jun 23",
        "Jun 23",
        "Jun 23",
        "Jun 23",
        "Jun 23"
      ]
    },
    "yaxis": {
      "domain": [
        0.7666666666666666,
        1
      ],
      "zeroline": false,
      "range": [
          0,
          12
      ],
      "tickvals": undefined,
      "ticktext": undefined
    },
    "xaxis2": {
        "range": [
          -0.05,
          12.05
        ],
        "type": advancedLjPlotlyAxisTypeCategory,
        "categoryorder": advancedLjCategoryOrder,
        "categoryarray": [
          "Jun 02",
          "Jun 02 ",
          " Jun 02 ",
          " Jun 02  ",
          "Jun 21",
          "Jun 21 ",
          " Jun 21 ",
          " Jun 21  ",
          "Jun 23",
          "Jun 23 ",
          " Jun 23 ",
          " Jun 23  ",
          "  Jun 23  "
        ],
      "tickmode": tickMode,
      "tickvals": [
        "Jun 02",
        "Jun 02 ",
        " Jun 02 ",
        " Jun 02  ",
        "Jun 21",
        "Jun 21 ",
        " Jun 21 ",
        " Jun 21  ",
        "Jun 23",
        "Jun 23 ",
        " Jun 23 ",
        " Jun 23  ",
        "  Jun 23  "
      ],
      "ticktext": [
        "Jun 02",
        "Jun 02",
        "Jun 02",
        "Jun 02",
        "Jun 21",
        "Jun 21",
        "Jun 21",
        "Jun 21",
        "Jun 23",
        "Jun 23",
        "Jun 23",
        "Jun 23",
        "Jun 23"
      ],
      "matches": "x"
    },
    "yaxis2": {
      "domain": [
        0.38333333333333336,
        0.6166666666666667
      ],
      "zeroline": false,
      "range": [
        0,
        12
      ],
      "tickvals": undefined,
      "ticktext": undefined
    },
    "xaxis3": {
        "range": [
          -0.05,
          12.05
        ],
        "type": advancedLjPlotlyAxisTypeCategory,
        "categoryorder": advancedLjCategoryOrder,
        "categoryarray": [
          "Jun 02",
          "Jun 02 ",
          " Jun 02 ",
          " Jun 02  ",
          "Jun 21",
          "Jun 21 ",
          " Jun 21 ",
          " Jun 21  ",
          "Jun 23",
          "Jun 23 ",
          " Jun 23 ",
          " Jun 23  ",
          "  Jun 23  "
        ],
      "tickmode": tickMode,
      "tickvals": [
        "Jun 02",
        "Jun 02 ",
        " Jun 02 ",
        " Jun 02  ",
        "Jun 21",
        "Jun 21 ",
        " Jun 21 ",
        " Jun 21  ",
        "Jun 23",
        "Jun 23 ",
        " Jun 23 ",
        " Jun 23  ",
        "  Jun 23  "
      ],
      "ticktext": [
        "Jun 02",
        "Jun 02",
        "Jun 02",
        "Jun 02",
        "Jun 21",
        "Jun 21",
        "Jun 21",
        "Jun 21",
        "Jun 23",
        "Jun 23",
        "Jun 23",
        "Jun 23",
        "Jun 23"
      ],
      "matches": "x"
    },
    "yaxis3": {
      "domain": [
        0,
        0.2333333333333333
      ],
      "zeroline": false,
      "range": [
        0,
        12
      ],
      "tickvals": undefined,
      "ticktext": undefined
    },
    "dragmode": "pan"
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedLjChartComponent],
      providers: [TranslateService],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedLjChartComponent);
    component = fixture.componentInstance;
    component.ljChart = ljChart1;
    spyOn(component, 'generatePlotlyGraph').and.resolveTo(new Promise<null>((resolve, reject) => {return null}));
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get and format plotly data', () => {
    fixture.detectChanges();
    let plotlyData = component.getFormattedPlotlyData(ljChart1);
    expect(plotlyData).toEqual(expectedPlotlyData);
  })

  it('should get and format plotly data onChanges', () => {
    fixture.detectChanges();
    let plotlyData = component.getFormattedPlotlyData(ljChart1);
    component.ngOnChanges();
    fixture.detectChanges();
    expect(plotlyData).toEqual(expectedPlotlyData);
  })

  it('should get and format plotly layout', () => {
    fixture.detectChanges();
    spyOn(component, 'getTranslation')
      .withArgs('TRANSLATION.LEVEL').and.returnValue('Level')
      .withArgs('TRANSLATION.FLOATING').and.returnValue('floating mean')
      .withArgs('TRANSLATION.FLOATINGSD').and.returnValue('floating SD')
      .withArgs('TRANSLATION.MEAN').and.returnValue('Mean')
      .withArgs('TRANSLATION.FIXEDMEAN').and.returnValue('fixed mean')
      .withArgs('TRANSLATION.FIXED').and.returnValue('fixed SD');
    let plotlyLayout = component.getFormattedPlotlyLayout(ljChart1);
    expect(plotlyLayout).toEqual(expectedPlotlyLayout);
  })
});
