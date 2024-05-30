// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, fakeAsync, async   } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';

import { ConnectivityMapTree } from '../../../../contracts/models/connectivity-map/connectivity-map-tree.model';
import { ChangeTrackerService } from '../../../../shared/guards/change-tracker/change-tracker.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { ReviewStatus } from '../../shared/models/review-status.model';
import { ConnectivitySchedulerDetailsComponent } from './connectivity-scheduler-details.component';
import { ParsingJobConfig } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { ApiService } from '../../../../shared/api/api.service';
import { ParsingEngineService } from '../../../../shared/services/parsing-engine.service';
import { MappingService } from '../../mapping/mapping.service';

describe('ConnectivitySchedulerDetailsComponent', () => {
  let component: ConnectivitySchedulerDetailsComponent;
  let fixture: ComponentFixture<ConnectivitySchedulerDetailsComponent>;

  const mockInstrumentId = "ee753bf7-1da5-4e2b-a0eb-91b381a2cte6";
  const trees: ConnectivityMapTree[] = [
    {
      'id': 'a8cd2d4e-c1b0-11ea-938a-06fe5f17c9ec',
      'labId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
      'locationId': null,
      'departmentId': null,
      'instrumentId': mockInstrumentId,
      'codes': [
        {
          'id': 'a8cd2d4e-c1b0-11ea-938a-06fe5f17c9ec',
          'code': 'AU600',
          'disabled': false
        }
      ],
      'product': [
        {
          'id': '98d87cfe-7adf-4a51-a6d8-124876cec325',
          'levelCodes': [
            {
              'id': '105',
              'lotLevel': 1,
              'codes': [
                {
                  'id': 'a8cd31a4-c1b0-11ea-bb1e-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--1',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': '21c9621c-b3e1-43a1-975d-96a4c9dea1fc',
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': 35,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': 4,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          'id': null,
          'levelCodes': [
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': '8db08c8a-d697-11ea-a459-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--2',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': '8db0913a-d697-11ea-a45a-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--3',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      'id': 'a8cd2d4e-c1b0-11ea-938a-06fe5f17c9ec',
      'labId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
      'locationId': null,
      'departmentId': null,
      'instrumentId': 'ee753bf7-1da5-4e2b-a0eb-91b381a2cte8',
      'codes': [
        {
          'id': 'a8cd2d4e-c1b0-11ea-938a-06fe5f17c9ec',
          'code': 'AU600',
          'disabled': false
        }
      ],
      'product': [
        {
          'id': '98d87cfe-7adf-4a51-a6d8-124876cec325',
          'levelCodes': [
            {
              'id': '105',
              'lotLevel': 1,
              'codes': [
                {
                  'id': 'a8cd31a4-c1b0-11ea-bb1e-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--1',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': '21c9621c-b3e1-43a1-975d-96a4c9dea1fc',
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': 35,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': 4,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          'id': null,
          'levelCodes': [
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': '8db08c8a-d697-11ea-a459-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--2',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': '8db0913a-d697-11ea-a45a-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--3',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

  ];

  const mockMappingService = {
    createConnectivityMapTrees: () => of(''),
    currentConnectivityMapTrees: of(trees)
  };

  const mockParsingEngineService = {
    getInstructions(accountId: string): Observable<any> {
      return of({
        configs: Array<ParsingJobConfig>(),
        unassociatedEdgeDeviceIds: []
      });
    }
  };

  const mockAnalytes = [
    {
      'id': '1ab73570-1d00-0000-0000-000000000001',
      'analyteName': 'Analyte 1',
      'manufacturerName': 'Beckman Coulter',
      'departmentName': 'Chemistry',
      'instrumentName': 'AU680',
      'instrumentId': 'a3e3c653-d082-4936-85f6-6b31b5a78462',
      'instrumentCustomName': '',
      'controlName': 'Liquichek Immunoassay Plus',
      'controlCustomName': '',
      'controlLotNumber': '5681723',
      'reagentName': 'CK REF OSR6X79',
      'isMicroslide': true,
      'availableReagentLotMetadata': [
        {
          'id': 501,
          'name': 'Slide Gen #15'
        },
        {
          'id': 502,
          'name': 'Slide Gen #16'
        }
      ],
      'reviewStatus': ReviewStatus.Accepted,
      'lastRunReagentLotId': 500,
      'lastRunReagentLotName': 'Slide Gen #14',
      'controlExpirationDate': '2022-02-28T00:00:00.000Z'
    },
    {
      'id': '1ab73570-1d00-0000-0000-000000000002',
      'analyteName': 'Analyte 2',
      'manufacturerName': '',
      'departmentName': 'Chemistry',
      'instrumentName': 'Beckman Coulter AU680',
      'instrumentCustomName': '',
      'instrumentId': 'a3e3c653-d082-4936-85f6-6b31b5a78463',
      'controlName': 'Liquichek Immunoassay Plus',
      'controlCustomName': '',
      'controlLotNumber': '5681723',
      'reagentName': 'CK REF OSR6X79',
      'isMicroslide': true,
      'availableReagentLotMetadata': [
        {
          'id': 601,
          'name': 'Slide Gen #35'
        },
        {
          'id': 602,
          'name': 'Slide Gen #36'
        }
      ],
      'reviewStatus': ReviewStatus.Empty,
      'lastRunReagentLotId': 600,
      'lastRunReagentLotName': 'Slide Gen #34',
      'controlExpirationDate': '2022-02-28T00:00:00.000Z'
    },
    {
      'id': '1ab73570-1d00-0000-0000-000000000003',
      "analyteName": "CK (Creatine Kinase)",
      "manufacturerName": "Ortho Clinical Diagnostics",
      "departmentName": "Slidegen Test",
      "instrumentName": "VITROS 5600",
      "instrumentId": mockInstrumentId,
      "instrumentCustomName": "",
      "controlName": "Cardiac Markers Plus",
      "controlCustomName": "",
      "reagentName": "CK REF 847 8034 (Microslide)",
      "controlLotNumber": "87840",
      "availableReagentLotMetadata": [
        { "id": 2505, "name": "Slide Gen #12" },
        { "id": 2507, "name": "Slide Gen #15" },
        { "id": 2509, "name": "Slide Gen #16" },
        { "id": 2511, "name": "Slide Gen #17" },
        { "id": 2513, "name": "Slide Gen #86" },
        { "id": 2515, "name": "Slide Gen #87" },
        { "id": 2786, "name": "Slide Gen #18" },
        { "id": 2788, "name": "Slide Gen #19" }
      ],
      "lastRunReagentLotId": 2515,
      'reviewStatus': ReviewStatus.Empty,
      "lastRunReagentLotName": "Slide Gen #87",
      "isMicroslide": true,
      'controlExpirationDate': '2022-02-28T00:00:00.000Z'
    },
    {
      'id': '1ab73570-1d00-0000-0000-000000000004',
      "analyteName": "CK (Creatine Kinase)",
      "manufacturerName": "Ortho Clinical Diagnostics",
      "departmentName": "Slidgen Test",
      "instrumentName": "VITROS 7600",
      "instrumentId": 'ee753bf7-1da5-4e2b-a0eb-91b381a2cte8',
      "instrumentCustomName": "",
      "controlName": "Cardiac Markers Plus",
      "controlCustomName": "",
      "reagentName": "CK REF 847 8034 (Microslide)",
      "controlLotNumber": "87840",
      "availableReagentLotMetadata": [
        { "id": 2505, "name": "Slide Gen #12" },
        { "id": 2507, "name": "Slide Gen #15" },
        { "id": 2509, "name": "Slide Gen #16" },
        { "id": 2511, "name": "Slide Gen #17" },
        { "id": 2513, "name": "Slide Gen #86" },
        { "id": 2515, "name": "Slide Gen #87" },
        { "id": 2786, "name": "Slide Gen #18" },
        { "id": 2788, "name": "Slide Gen #19" }
      ],
      "lastRunReagentLotId": 2515,
      'reviewStatus': ReviewStatus.Empty,
      "lastRunReagentLotName": "Slide Gen #87",
      "isMicroslide": true,
      'controlExpirationDate': '2022-02-28T00:00:00.000Z'
    }
  ];

  const analytesAccepted = [
    {
      'id': '1ab73570-1d00-0000-0000-000000000001',
      'analyteName': 'Analyte 1',
      'manufacturerName': 'Beckman Coulter',
      'departmentName': 'Chemistry',
      'instrumentName': 'AU680',
      'instrumentCustomName': '',
      'instrumentId': 'a3e3c653-d082-4936-85f6-6b31b5a78462',
      'controlName': 'Liquichek Immunoassay Plus',
      'controlCustomName': '',
      'controlLotNumber': '5681723',
      'reagentName': 'CK REF OSR6X79',
      'isMicroslide': true,
      'availableReagentLotMetadata': [
        {
          'id': 501,
          'name': 'Slide Gen #15'
        },
        {
          'id': 502,
          'name': 'Slide Gen #16'
        }
      ],
      'reviewStatus': ReviewStatus.Accepted,
      'lastRunReagentLotId': 500,
      'lastRunReagentLotName': 'Slide Gen #14',
      'controlExpirationDate': '2022-02-28T00:00:00.000Z'
    }
  ];

  const analytesEdited = [
    {
      'id': '1ab73570-1d00-0000-0000-000000000001',
      'analyteName': 'Analyte 1',
      'manufacturerName': 'Beckman Coulter',
      'departmentName': 'Chemistry',
      'instrumentName': 'AU680',
      'instrumentCustomName': '',
      'instrumentId': 'a3e3c653-d082-4936-85f6-6b31b5a78462',
      'controlName': 'Liquichek Immunoassay Plus',
      'controlCustomName': '',
      'controlLotNumber': '5681723',
      'reagentName': 'CK REF OSR6X79',
      'isMicroslide': true,
      'availableReagentLotMetadata': [
        {
          'id': 501,
          'name': 'Slide Gen #15'
        },
        {
          'id': 502,
          'name': 'Slide Gen #16'
        }
      ],
      'reviewStatus': ReviewStatus.Edited,
      'lastRunReagentLotId': 500,
      'lastRunReagentLotName': 'Slide Gen #14',
      'controlExpirationDate': '2022-02-28T00:00:00.000Z'
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),],
      declarations: [ConnectivitySchedulerDetailsComponent],
      providers: [
        { provide: ChangeTrackerService },
        { provide: MappingService, useValue: mockMappingService },
        { provide: ParsingEngineService, useValue: mockParsingEngineService },
        TranslateService,
        ApiService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectivitySchedulerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should display need to review analytes on click on "need review" button', () => {
    component.recordsPerPage = 2;
    component.analytesFiltered = mockAnalytes;
    const needReviewButton = fixture.debugElement.query(By.css('.spec-need-review')).nativeElement;
    const count = component.getCount(ReviewStatus.Empty);
    expect(needReviewButton.textContent).toEqual('Need review (' + (count) + ')');
    needReviewButton.click();
    component.reviewStatus = 2;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      spyOn(component, 'filterItems').and.callThrough();
      component.filterItems(ReviewStatus.Empty);
      expect(component.filterItems).toHaveBeenCalledWith(ReviewStatus.Empty);
      component.selectPage(1);
      component.updateFilteredAnalytes();
      component.createPages();
    });
  });

  xit('should display updated analytes on click on "Updated" button', () => {
    component.recordsPerPage = 2;
    component.analytesFiltered = mockAnalytes;
    const updatedButton = fixture.debugElement.query(By.css('.spec-updated')).nativeElement;
    const count = component.getCount(ReviewStatus.Edited);
    expect(updatedButton.textContent).toEqual('Updated (' + (count) + ')');
    updatedButton.click();
    component.reviewStatus = 3;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      spyOn(component, 'filterItems').and.callThrough();
      component.filterItems(ReviewStatus.Edited);
      expect(component.filterItems).toHaveBeenCalledWith(ReviewStatus.Edited);
      component.selectPage(1);
      component.updateFilteredAnalytes();
      component.createPages();
    });
  });

  xit('should display accepted analytes on click on "Accepted" button', () => {
    component.recordsPerPage = 2;
    component.analytesFiltered = mockAnalytes;
    const acceptedButton = fixture.debugElement.query(By.css('.spec-accepted')).nativeElement;
    acceptedButton.click();
    const count = component.getCount(ReviewStatus.Accepted);
    expect(acceptedButton.textContent).toEqual('Accepted (' + (count) + ')');
    component.reviewStatus = 1;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      spyOn(component, 'filterItems').and.callThrough();
      component.filterItems(ReviewStatus.Accepted);
      expect(component.filterItems).toHaveBeenCalledWith(ReviewStatus.Accepted);
      component.selectPage(1);
      component.updateFilteredAnalytes();
      component.createPages();
    });
  });

  xit('should display file upload screen on click on back button', () => {
    const backButton = fixture.debugElement.query(By.css('.spec-back')).nativeElement;
    expect(backButton.textContent).toEqual('Back');
    backButton.click();
    const spy = spyOn(component.backClicked, 'emit');
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  xit('should upload data on click on submit button', () => {
    const uploadButton = fixture.debugElement.query(By.css('.spec-upload')).nativeElement;
    expect(uploadButton.textContent).toEqual('Upload');
    uploadButton.click();
    const spy = spyOn(component.upload, 'emit');
    component.submit();
    expect(spy).toHaveBeenCalled();
  });

  xit('should expand when Update button is clicked', () => {
    component.analytes = mockAnalytes;
    component.analytesFiltered = mockAnalytes;
    const needReviewBtn = fixture.debugElement.queryAll(By.css('.pill-button'))[0];
    needReviewBtn.triggerEventHandler('click', ReviewStatus.Empty);
    fixture.detectChanges();
    const analytesFiltered = fixture.debugElement.query(By.css('.spec-list-item'));
    const updateBtn = fixture.debugElement.query(By.css('.spec-update-slidegen-list'));
    expect(updateBtn.nativeElement.textContent).toEqual('update');
    updateBtn.nativeElement.click();
    fixture.detectChanges();
    expect(component.selectedItemIndex).toEqual(0);
    expect(analytesFiltered.classes['expand']).toBeTruthy();
  });

  it('should display "All analytes are reviewed" message if no analyte are pending for review ', () => {
    component.reviewStatus = ReviewStatus.Empty;
    component.analytesFiltered.length = 0;
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    // expect(compiled.querySelector('.spec-all-reviewed').textContent).toContain('All analytes are reviewed');
  });

  xit('should render Edit button when "Updated" or "Accepted" pill button is selected', () => {
    component.analytes = analytesEdited;
    const userElements = fixture.debugElement.queryAll(By.css('.pill-button'));
    userElements[1].triggerEventHandler('click', ReviewStatus.Edited);
    fixture.detectChanges();
    component.analytesFiltered.forEach(item => { expect(item.reviewStatus).not.toBe(ReviewStatus.Empty); });
    let editButton = fixture.debugElement.query(By.css('.edit-button .selected'));
    expect(editButton.nativeElement.textContent).toEqual('edit');

    component.analytes = analytesAccepted;
    userElements[2].triggerEventHandler('click', ReviewStatus.Accepted);
    fixture.detectChanges();
    component.analytesFiltered.forEach(item => { expect(item.reviewStatus).not.toBe(ReviewStatus.Empty); });
    editButton = fixture.debugElement.query(By.css('.edit-button .selected'));
    expect(editButton.nativeElement.textContent).toEqual('edit');
  });

  //todo: fix test case by removing invalid array range error.
  xit('should not display anaylites if vitro 5600 or vitro 7600 have a mapped code when click on "need review" button',
    fakeAsync(() => {
      component.analytesFiltered = mockAnalytes;
      component.codesMapTree = trees;
      const needReviewButton = fixture.debugElement.query(By.css('.spec-need-review')).nativeElement;
      const count = component.getCount(ReviewStatus.Empty);
      expect(needReviewButton.textContent).toEqual('Need review (' + (count) + ')');
      needReviewButton.click();
      component.reviewStatus = 2;
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        spyOn(component, 'filterItems').and.callThrough();
        component.filterItems(ReviewStatus.Empty);
        expect(component.filterItems).toHaveBeenCalledWith(ReviewStatus.Empty);
        component.selectPage(1);
        component.updateFilteredAnalytes();
        component.createPages();
      });
    })
  );
});
