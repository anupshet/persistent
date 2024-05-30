// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';


import { ReportSelectedItemsComponent } from './report-selected-items.component';
import { InstrumentResponse } from '../../../models/report-info';
import { HttpLoaderFactory } from '../../../../../app.module';

describe('ReportSelectedItemsComponent', () => {
  let component: ReportSelectedItemsComponent;
  let fixture: ComponentFixture<ReportSelectedItemsComponent>;
  const changesData = {
    labConfigData: {
      currentValue: {
        analytes: [
          {
            id: '41bc43a7-2fbd-45e0-bca9-af0f86fcc398',
            name: 'Cortisol',
            nodeType: 6,
            analyteId: 41,
            isChecked: false,
            isFiltered: false
          },
          {
            id: '41bc43a7-2fbd-45e0-bca9-af0f86fcc399',
            name: 'Cortisol',
            nodeType: 6,
            analyteId: 41,
            isChecked: false,
            isFiltered: true
          },
          {
            id: '41bc43a7-2fbd-45e0-bca9-af0f86fcc300',
            name: 'Cortisol',
            nodeType: 6,
            analyteId: 41,
            isChecked: true,
            isFiltered: false
          },
          {
            id: '41bc43a7-2fbd-45e0-bca9-af0f86fcc301',
            name: 'Cortisol',
            nodeType: 6,
            analyteId: 41,
            isChecked: true,
            isFiltered: true
          }],
        controls: [
          {
            isFiltered: true,
            masterLotProductId: 41,
            name: 'Immunoassay Plus',
            groups: [
              {
                id: 'e20c4990-7cd8-433b-b62e-dbb50e1a0a16',
                name: 'Immunoassay Plus',
                parentId: '5ac61926-7c3b-4664-bd93-a08bf709029e',
                productCustomName: '',
                lotNumber: '40380',
                productId: 41,
                productMasterLotId: 1006,
                nodeType: 5,
                lotExpiryDate: '2022-08-31T00:00:00Z',
                isFiltered: true
              },
              {
                id: '2862d5f3-b493-48a7-9f48-c8b71852c441',
                name: 'Immunoassay Plus',
                parentId: 'e8982e4f-a4ae-48fb-a10c-20496ddb2b2e',
                productCustomName: '',
                lotNumber: '85280',
                productId: 41,
                productMasterLotId: 1385,
                nodeType: 5,
                lotExpiryDate: '2023-05-31T00:00:00Z',
                isFiltered: true
              },
              {
                id: '541a329d-d9e7-4d7f-bf65-f7e403f5ee80',
                name: 'Immunoassay Plus',
                parentId: 'e8982e4f-a4ae-48fb-a10c-20496ddb2b2e',
                productCustomName: '',
                lotNumber: '85300',
                productId: 41,
                productMasterLotId: 1517,
                nodeType: 5,
                lotExpiryDate: '2023-11-30T00:00:00Z',
                isFiltered: true
              },
              {
                id: '22b9068d-e9b0-45d7-96c8-5b147148d227',
                name: 'Immunoassay Plus',
                parentId: 'e8982e4f-a4ae-48fb-a10c-20496ddb2b2e',
                productCustomName: '',
                lotNumber: '85310',
                productId: 41,
                productMasterLotId: 1749,
                nodeType: 5,
                lotExpiryDate: '2024-02-29T00:00:00Z',
                isFiltered: true
              }]
          },
          {
            isFiltered: true,
            masterLotProductId: 162,
            name: 'Elevated CRP',
            groups: [
              {
                id: 'a51fddec-5d5b-457d-a12e-6ff38719f631',
                isFiltered: true,
                lotExpiryDate: '2024-02-29T00:00:00Z',
                lotNumber: '35500',
                name: 'Elevated CRP',
                nodeType: 5,
                parentId: '6cb335e0-dfcd-4720-862e-63bd7cd5714c',
                productCustomName: 'test3',
                productId: 162,
                productMasterLotId: 1782

              }
            ]
          },
          {
            isFiltered: true,
            masterLotProductId: 49,
            name: 'Urine Chemistry',
            groups: [
              {
                id: '0a53de94-4b5d-4629-b0e0-368cd616884c',
                isFiltered: true,
                lotExpiryDate: '2024-03-31T00:00:00Z',
                lotNumber: '88180',
                name: 'Urine Chemistry',
                nodeType: 5,
                parentId: '6cb335e0-dfcd-4720-862e-63bd7cd5714c',
                productCustomName: 'test4',
                productId: 49,
                productMasterLotId: 1785
              }
            ]
          }
        ],
        departments: [
          {
            id: 'b90802e6-ab31-4c0b-a15f-43d243b1ebb7',
            isChecked: true,
            name: 'New4May',
            nodeType: 3,
            parentId: '4ebf2f52-3936-4203-bf93-3f8befab64eb'
          },
          {
            id: 'b90802e6-ab31-4c0b-a15f-43d243b1ebb8',
            isChecked: true,
            name: 'New6May',
            nodeType: 3,
            parentId: '4ebf2f52-3936-4203-bf93-3f8befab64ec'
          },
          {
            id: 'b90802e6-ab31-4c0b-a15f-43d243b1ebb9',
            isChecked: false,
            name: 'New5May',
            nodeType: 3,
            parentId: '4ebf2f52-3936-4203-bf93-3f8befab64ed'
          }
        ],
        instruments: [
          {
            name: 'AU2700',
            codelistInstrumentId: 2299,
            isFiltered: true,
            groups: [
              {
                id: 'b856044a-d9b2-4a0d-8c12-ff376a21c1df',
                name: 'AU2700',
                parentId: 'f6d28503-c12f-4302-8f5f-cd66a17f9fd7',
                instrumentCustomName: '',
                serialNumber: '',
                instrumentId: 2299,
                manufacturerId: 14,
                manufacturerName: 'Beckman Coulter',
                nodeType: 4,
                isFiltered: true
              },
              {
                id: 'f8acf0f2-b653-4e78-b46c-788e2657158a',
                name: 'AU2700',
                parentId: 'df7b1f7e-5f20-4ff5-a67c-a9d3d039d738',
                instrumentCustomName: '',
                serialNumber: '',
                instrumentId: 2299,
                manufacturerId: 14,
                manufacturerName: 'Beckman Coulter',
                nodeType: 4,
                isFiltered: true
              }
            ]
          },
          {
            name: 'AU2700',
            codelistInstrumentId: 2299,
            isFiltered: true,
            groups: [
              {
                id: 'b856044a-d9b2-4a0d-8c12-ff376a21c1df',
                name: 'AU2700',
                parentId: 'f6d28503-c12f-4302-8f5f-cd66a17f9fd7',
                instrumentCustomName: '',
                serialNumber: '',
                instrumentId: 2299,
                manufacturerId: 14,
                manufacturerName: 'Beckman Coulter',
                nodeType: 4,
                isFiltered: true
              },
              {
                id: 'f8acf0f2-b653-4e78-b46c-788e2657158b',
                name: 'AU2701',
                parentId: 'df7b1f7e-5f20-4ff5-a67c-a9d3d039d740',
                instrumentCustomName: '',
                serialNumber: '',
                instrumentId: 2299,
                manufacturerId: 14,
                manufacturerName: 'Beckman Coulter Two',
                nodeType: 4,
                isFiltered: false
              }
            ]
          }
        ],
        locations: [
          {
            id: '61ae3697-fdce-40ae-ba39-11226e520ada',
            instrumentGroupByDept: true,
            isChecked: true,
            name: '2Mar',
            nodeType: 3,
            parentId: '4ebf2f52-3936-4203-bf93-3f8befab64eb'
          }
        ]
      }
    }
  };
  const controlGroupData = [{
    id: '2ea589aa-d44e-4619-9389-a2071c774074',
    isFiltered: true,
    isChecked: true,
    lotExpiryDate: '2024-05-31T00:00:00Z',
    lotNumber: '55780',
    name: 'Diabetes (Liquichek)',
    nodeType: 5
  },
  {
    id: 'ea94c4b4-1705-46b1-8d6d-4a8e5fc3e549',
    isFiltered: false,
    isChecked: true,
    lotExpiryDate: '2022-10-25T00:00:00Z',
    lotNumber: '43290',
    name: 'Animea',
    nodeType: 5
  },
  {
    id: '2ea589aa-d44e-4619-9389-a2071c774074',
    isFiltered: true,
    isChecked: false,
    lotExpiryDate: '2024-05-31T00:00:00Z',
    lotNumber: '55789',
    name: 'Diabetes (Liquichek)',
    nodeType: 5
  },
  {
    id: '2ea589aa-d44e-4619-9389-a2071c774077',
    isFiltered: false,
    isChecked: false,
    lotExpiryDate: '2024-06-31T00:00:00Z',
    lotNumber: '55788',
    name: 'Diabetes (Liquichek)',
    nodeType: 5
  }];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatExpansionModule, BrowserAnimationsModule, MatTabsModule, MatIconModule, HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ReportSelectedItemsComponent],
      providers: [
        TranslateService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSelectedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a panel', () => {
    const panel = fixture.debugElement.query(By.css('mat-expansion-panel'));
    expect(panel).toBeTruthy();
  });

  it('should expand and collapse the panel on click', () => {
    const panel = fixture.debugElement.query(By.css('mat-expansion-panel'));
    const header = fixture.debugElement.query(By.css('mat-expansion-panel-header'));
    expect(panel.classes['mat-expanded']).toBeFalsy();
    header.nativeElement.click();
    fixture.detectChanges();
    expect(panel.classes['mat-expanded']).toBeTruthy();
    header.nativeElement.click();
    fixture.detectChanges();
    expect(panel.classes['mat-expanded']).toBeFalsy();
  });

  it('should have four tabs and should open the tab on click', () => {
    const tabLabels = fixture.debugElement.queryAll(By.css('.mat-tab-label'));
    expect(tabLabels.length).toEqual(4);
    expect(tabLabels[0].nativeElement.textContent).toEqual('REPORTSELECTEDITEMS.LOCATIONANDDEPARTMENT');
    expect(tabLabels[1].nativeElement.textContent).toEqual('REPORTSELECTEDITEMS.INSTRUMENT');
    expect(tabLabels[2].nativeElement.textContent).toEqual('REPORTSELECTEDITEMS.CONTROL');
    expect(tabLabels[3].nativeElement.textContent).toEqual('REPORTSELECTEDITEMS.ANALYTE');

    tabLabels[0].triggerEventHandler('click', null);
    fixture.detectChanges();

    // check that the first tab is open and remaining is closed
    expect(tabLabels[0].classes['mat-tab-label-active']).toBe(true);
    expect(tabLabels[1].classes['mat-tab-label-active']).not.toBe(true);
    expect(tabLabels[2].classes['mat-tab-label-active']).not.toBe(true);
    expect(tabLabels[3].classes['mat-tab-label-active']).not.toBe(true);

    tabLabels[1].triggerEventHandler('click', null);
    fixture.detectChanges();

    // check that the second tab is open and remaining tabs are closed
    expect(tabLabels[0].classes['mat-tab-label-active']).not.toBe(true);
    expect(tabLabels[1].classes['mat-tab-label-active']).toBe(true);
    expect(tabLabels[2].classes['mat-tab-label-active']).not.toBe(true);
    expect(tabLabels[3].classes['mat-tab-label-active']).not.toBe(true);

    tabLabels[2].triggerEventHandler('click', null);
    fixture.detectChanges();

    // check that the third tab is open and remaining tabs are closed
    expect(tabLabels[0].classes['mat-tab-label-active']).not.toBe(true);
    expect(tabLabels[1].classes['mat-tab-label-active']).not.toBe(true);
    expect(tabLabels[2].classes['mat-tab-label-active']).toBe(true);
    expect(tabLabels[3].classes['mat-tab-label-active']).not.toBe(true);

    tabLabels[3].triggerEventHandler('click', null);
    fixture.detectChanges();

    // check that the fourth tab is open and remaining tabs are closed
    expect(tabLabels[0].classes['mat-tab-label-active']).not.toBe(true);
    expect(tabLabels[1].classes['mat-tab-label-active']).not.toBe(true);
    expect(tabLabels[2].classes['mat-tab-label-active']).not.toBe(true);
    expect(tabLabels[3].classes['mat-tab-label-active']).toBe(true);
  });

  it('should show up/down icon with respect to the expansion panel state', () => {
    const expansionPanel = fixture.debugElement.query(By.css('.mat-expansion-panel-header'));
    let iconElement1: any = expansionPanel.query(By.css('.expandedIconArrowUp'));
    let iconElement2: any = expansionPanel.query(By.css('.expandedIconArrowDown'));
    expect(iconElement1).not.toBeNull();
    expect(iconElement2).toBeNull();
    expansionPanel.triggerEventHandler('click', null);
    fixture.detectChanges();
    iconElement1 = expansionPanel.query(By.css('.expandedIconArrowUp'));
    iconElement2 = expansionPanel.query(By.css('.expandedIconArrowDown'));
    expect(iconElement1).toBeNull();
    expect(iconElement2).not.toBeNull();
  });

  it('check whether proper instrument neme is getting returned or not in getDisplayNameForInstrument() method', () => {
    const instrumentGroup: InstrumentResponse = {
      id: '4d90aa40-5df2-46b7-b266-07be960b62b6',
      instrumentCustomName: '',
      isFiltered: false,
      manufacturerId: 7,
      manufacturerName: 'ABON Biopharma',
      name: 'AU2800',
      nodeType: 4,
      parentId: '617b5989-3a1e-420c-8721-2cf3fd5c8111',
      serialNumber: '',
      instrumentId: 0,
      isChecked: false,
      tooltipData: null,
      isDisabled: false
    };
    expect(component.getDisplayNameForInstrument(instrumentGroup)).toBe(instrumentGroup.name);
  });

  it('checking whether correct lot numbers are getting returned or not in getDisplayNameForControlGroup() method', () => {
    component.isControlChecked = true;
    const controlGroup: any = controlGroupData;

    const lotArray: any = ['55780', '43290'];
    expect(component.getDisplayNameForControlGroup(controlGroup)).toEqual(lotArray);

    component.isControlChecked = false;
    const lotArray2: any = ['43290', '55788'];
    expect(component.getDisplayNameForControlGroup(controlGroup)).toEqual(lotArray2);
  });

  it('checking whether items are checked or not during NgOnChanged trigger', () => {
    const changesOne: any = changesData;
    component.ngOnChanges(changesOne);
    expect(component.instrumentGroupByDept).toEqual(true);
    expect(component.hasDepartmentChecked).toEqual(true);
    expect(component.isDepartmentChecked).toEqual(true);
    expect(component.isInstrumentChecked).toEqual(false);
    expect(component.isAnalyteChecked).toEqual(true);
    expect(component.isControlChecked).toEqual(false);
    expect(component.allCheck).toEqual(true);

  });
});

