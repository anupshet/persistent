// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule, InfoTooltipComponent } from 'br-component-library';
import { NodeInfoDetailsComponent } from './node-info-details.component';
import { HttpLoaderFactory } from '../../../app.module';

describe('NodeInfoDetailsComponent', () => {
  let component: NodeInfoDetailsComponent;
  let fixture: ComponentFixture<NodeInfoDetailsComponent>;

  const mockHeaderData = {
    'analyteName': 'Alkaline Phosphatase',
    'instrumentName': 'AU2700',
    'instrumentAlias': '',
    'customProductName': '',
    'productName': 'Assayed Chemistry',
    'productMasterLotNumber': '23000',
    'reagentName': 'ALP REF OSR6X04',
    'reagentLotNumber': 'Unspecified ***',
    'reagentLotId': 5,
    'method': 'PNPP, AMP Buffer',
    'calibrator': 'Cal 66300',
    'calibratorLotNumber': 'Unspecified ***',
    'calibratorLotId': 5,
    'codeListTestId': 1081,
    'labUnitId': 56,
    'unit': null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NodeInfoDetailsComponent,
        InfoTooltipComponent
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
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
      providers: [TranslateService,]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeInfoDetailsComponent);
    component = fixture.componentInstance;
    component.headerData = mockHeaderData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showNodeDetails to get details when click on icon', () => {
    const iconElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_icon');
    const spy = spyOn(component, 'showNodeDetails');
    iconElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should show the tooltip with analyte details on click of icon', () => {
    const iconElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_icon');
    const analyteDetailsMenuElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('mat-menu');
    const spyEmit = spyOn(component.getNodeDetails, 'emit');
    iconElement.click();
    fixture.detectChanges();
    expect(analyteDetailsMenuElement).toBeTruthy();
    expect(spyEmit).toHaveBeenCalledWith(true);
  });
});
