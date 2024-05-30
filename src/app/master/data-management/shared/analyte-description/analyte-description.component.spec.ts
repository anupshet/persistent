// <!-- © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.-->

import { ComponentFixture, TestBed, async   } from "@angular/core/testing";
import { Subject } from "rxjs";
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AnalyteDescriptionComponent } from "./analyte-description.component";
import { HttpLoaderFactory } from '../../../../app.module';

describe('AnalyteDescriptionComponent', () => {
  let component: AnalyteDescriptionComponent;
  let fixture: ComponentFixture<AnalyteDescriptionComponent>;
  let destroy$: Subject<boolean>;

  let mockHeader = {
    "analyteName": "Alkaline Phosphatase",
    "instrumentName": "ARCHITECT c16000",
    "instrumentAlias": "184708 inst",
    "customProductName": "",
    "productName": "Multiqual 1,2,3 Unassayed",
    "productMasterLotNumber": "56610",
    "reagentName": "Alkaline Phosphatase REF 7D55-21",
    "reagentLotNumber": "Unspecified ***",
    "reagentLotId": 420,
    "method": "PNPP, AMP Buffer",
    "unit": "U/L",
    "calibrator": "Abbott No Cal",
    "calibratorLotNumber": "Unspecified ***",
    "calibratorLotId": 415,
    "codeListTestId": 3312,
    "labUnitId": 56,
    "lotExpiringDate": new Date("2021-07-31T00:00:00")
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnalyteDescriptionComponent
      ],
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
      ],
      providers: [TranslateService, ]
    })
    .compileComponents();

    destroy$ = new Subject<boolean>();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyteDescriptionComponent);
    component = fixture.componentInstance;
    component.headerData = mockHeader;
    component.hierarchyText = '184708 inst / Multiqual 1,2,3 Unassayed Lot 56610 expires 31 Jul 2021';
    fixture.detectChanges();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display expected hiearchyText', () => {
    fixture.detectChanges();
    let description = fixture.debugElement.nativeElement.querySelector('#spec_analyte-description-hierarchyText');
    expect(description.textContent).toContain('184708 inst / Multiqual 1,2,3 Unassayed Lot 56610 expires 31 Jul 2021');
  });

  it('should display expected header information', () => {
    fixture.detectChanges();
    let method = fixture.debugElement.nativeElement.querySelector('#spec_analyte-description-method');
    let reagent = fixture.debugElement.nativeElement.querySelector('#spec_analyte-description-reagent');
    let calibrator = fixture.debugElement.nativeElement.querySelector('#spec_analyte-description-calibrator');
    let unitOfMeasure = fixture.debugElement.nativeElement.querySelector('#spec_analyte-description-unitOfMeasure');

    expect(method.textContent).toContain(' ' + mockHeader.method);
    expect(reagent.textContent).toContain(' ' + mockHeader.reagentName);
    expect(calibrator.textContent).toContain(' ' + mockHeader.calibrator);
    expect(unitOfMeasure.textContent).toContain(' ' + mockHeader.unit);
});

});
