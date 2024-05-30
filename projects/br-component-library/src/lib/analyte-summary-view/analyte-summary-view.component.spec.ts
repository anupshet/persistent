// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { BrCore } from '../shared';
import { MaterialModule } from '../material-module';
import { BrPezCell } from '../pez-cell/pez-cell.module';
import { BrAnalyteSummaryViewComponent } from './analyte-summary-view.component';
import { AnalyteSummaryView } from '../contracts';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../../../src/app/app.module';

describe('AnalyteSummaryViewComponent', () => {
  let component: BrAnalyteSummaryViewComponent;
  let fixture: ComponentFixture<BrAnalyteSummaryViewComponent>;

  const levelDataSetDefault = [
    {
      level: 1,
      decimalPlace: null,
      controlLotId: 100,
      isPristine: true,
      data: {
        mean: 10.1,
        sd: 1.22,
        cv: null,
        numPoints: 10
      }
    },
    {
      level: 2,
      decimalPlace: null,
      controlLotId: 100,
      isPristine: true,
      data: {
        mean: 12.1,
        sd: 2.33,
        cv: null,
        numPoints: 10
      }
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BrAnalyteSummaryViewComponent],
      imports: [
        CommonModule,
        MaterialModule,
        BrPezCell,
        BrCore,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        TranslateService,
        HttpClient
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrAnalyteSummaryViewComponent);
    component = fixture.componentInstance;
    component.analyteView = new AnalyteSummaryView();
    component.analyteView.analyteName = 'Analyte_Name';
    component.analyteView.cumulativeLevels = [1, 2];
    component.analyteView.levelDataSet = levelDataSetDefault;
    component.analyteView.analyteDateTime = new Date('2021-02-28T23:59:59.999Z');
    fixture.detectChanges();
  });

/*   it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create Analyte Summary View Table with Header rows', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(tableRows.length).toBe(3);

    // Heading Rows
    // validate in UI after NON-BIO-Rad-LOT Changes
    const headerRow1 = tableRows[0];
    expect(headerRow1.cells[0].innerHTML).toBe('<span _ngcontent-a-c278="" ng-reflect-ng-class="[object Object]" class="br-capitalize">mean</span>');

    const headerRow2 = tableRows[1];
    expect(headerRow2.cells[0].innerHTML).toBe('<span _ngcontent-a-c278="" ng-reflect-ng-class="[object Object]" class="br-uppercase">sd</span>');

    const headerRow3 = tableRows[2];
    expect(headerRow3.cells[0].innerHTML).toBe('<span _ngcontent-a-c278="" ng-reflect-ng-class="[object Object]" class="br-capitalize">points</span>');
  });

  it('should display analyte details in Header', () => {
    const analyteName = '- Analyte_Name';
    component.isSinglePageSummary = false;
    component.analyteView.analyteName = analyteName;
    fixture.detectChanges();

    const headerText1 = fixture.debugElement.query(By.css('#spc_summary_view_analyte_name'));
    expect(headerText1.nativeElement.textContent).toBe(analyteName);

    const headerText2 = fixture.debugElement.query(By.css('#spc_summary_view_date'));
    expect(headerText2.nativeElement.textContent.trim()).toContain('February 2021');
  });

  it('should contain Pez component', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect((compiled.querySelector('br-pez-cell'))).toBeTruthy();
  }); */
});
