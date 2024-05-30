// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { ComponentFixture, fakeAsync, TestBed, async   } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Autofixture } from 'ts-autofixture/dist/src';
import { Observable, of } from 'rxjs';

import { ActivatedRouteStub } from '../../../../testing/activated-route-stub';
import { ApiResponse } from '../../../contracts/models/connectivity/api-response.model';
import { ParsingInfo, ParsingJobConfig } from '../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { SharedModule } from '../../../shared/shared.module';
import { ApiService } from '../../../shared/api/api.service';
import { FileReceiveService } from '../shared/services/file-receive.service';
import { FileVerificationService } from '../shared/services/file-verification.service';
import { ParsingEngineService } from '../../../shared/services/parsing-engine.service';
import { UploadComponent } from './upload.component';
import { HeaderService } from '../shared/header/header.service';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { InstructionsService } from '../instructions/instructions.service';
import { allDates, dateRangeOpened } from '../../../core/config/constants/general.const';
import { ReviewStatus } from '../shared/models/review-status.model';
import { LabConfigurationApiService } from '../../../shared/services/lab-configuration.service';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../app.module';
import { ConfigService } from '../../../core/config/config.service';

const mockParsingEngineService = {
  getInstructions(accountId: string): Observable<ParsingInfo> {
    return of({
      configs: Array<ParsingJobConfig>(),
      unassociatedEdgeDeviceIds: []
    });
  }
};

const mockFileReceiveService = {
  postFiles(data: any): Observable<any> {
    return of({});
  },

  updateFileStatus(statusData: any): Observable<any> {
    return of({});
  }
};

const mockApiService = {
  putFileWithS3(url: string, fileData: any, showAsBusy: boolean): Observable<any> {
    return of({});
  }
};

const mockErrorLoggerService = {
  logErrorToBackend: (error: BrError) => { },
  populateErrorObject: () => {
    return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
  }
};

const mockAnalytes = [{
  'id': '1ab73570-1d00-0000-0000-000000000001',
  'analyteName': 'Analyte 1',
  'manufacturerName': 'Beckman Coulter',
  'departmentName': 'Chemistry',
  'instrumentName': 'AU680',
  'instrumentCustomName': '',
  'controlName': 'Liquichek Immunoassay Plus',
  'controlCustomName': '',
  'controlLotNumber': '5681723',
  'reagentName': 'CK REF OSR6X79',
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
  'reviewStatus': ReviewStatus.Empty,
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
  'controlName': 'Liquichek Immunoassay Plus',
  'controlCustomName': '',
  'controlLotNumber': '5681723',
  'reagentName': 'CK REF OSR6X79',
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
}];

const mockLabConfigurationApiService = {
  getTests: () => of(mockAnalytes)
};

const mockBrPermissionsService = {
  hasAccess: () => true,
};

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let parsingEngineService: ParsingEngineService;
  let fileReceiveApiService: FileReceiveService;
  let apiService: ApiService;
  const appState = [];
  const autofixture = new Autofixture();
  const selectedInstructionDefault = {
    name: 'X-Wing',
    id: '050477',
    edgeDeviceIds: ['88888888-4444-4444-4444-cccccccccccc'],
    isGenericASTM: false,
    handlesSlideGen: false,
    createdTime: '',
    isConfigured: false
  };
  const parsingInfoDefault = {
    'configs': [
      {
        'id': '00000000-0000-0000-0000-000000000000',
        'name': 'Rebel\'s Spacecraft Manual',
        'edgeDeviceIds': [
          '88888888-4444-4444-4444-cccccccccccc'
        ],
        'isGenericASTM': true,
        'handlesSlideGen': false,
        'createdTime': '2021-04-08T20:05:20.03Z',
        'isConfigured': false
      },
      {
        'id': '00000000-0000-0000-0000-000000000001',
        'name': 'Empire\'s Spacecraft Manual',
        'edgeDeviceIds': [],
        'isGenericASTM': false,
        'handlesSlideGen': false,
        'createdTime': '2021-04-08T20:05:20.03Z',
        'isConfigured': false
      }
    ],
    'unassociatedEdgeDeviceIds': [
      '88888888-4444-4444-4444-ffffffffffff'
    ]
  };

  const activatedRouteStub = new ActivatedRouteStub(null, { id: '1' });
  const ConfigServiceStub = {
    getConfig: () => {
      return { 'auditTrail': '' };
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        FormsModule,
        SharedModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        NgReduxTestingModule,
        MatIconModule,
        StoreModule.forRoot(appState),
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
      declarations: [UploadComponent],
      providers: [
        { provide: ParsingEngineService, useValue: mockParsingEngineService },
        { provide: FileReceiveService, useValue: mockFileReceiveService },
        { provide: ApiService, useValue: mockApiService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: HeaderService, usevalue: {} },
        { provide: LabConfigurationApiService, useValue: mockLabConfigurationApiService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ConfigService, useValue: ConfigServiceStub },
        MessageSnackBarService,
        TranslateService,
        {
          provide: InstructionsService,
          useValue: {
            increaseStep: () => of({}),
            getStep: () => of({}),
            getNextBtnState: () => of({}),
            getResetBtnState: () => of({}),
            setNewPath: () => of({})
          }
        },
        FileVerificationService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UploadComponent);
        component = fixture.componentInstance;
        component.selectedInstruction = {
          id: 'test_id123',
          name: 'test_name',
          edgeDeviceIds: ['abc', 'test']
        };
        component.configurationList = parsingInfoDefault.configs;
        parsingEngineService = TestBed.inject(ParsingEngineService);
        fileReceiveApiService = TestBed.inject(FileReceiveService);
        apiService = TestBed.inject(ApiService);
        fixture.detectChanges();
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getInstructions', () => {
    it('should have empty selected instruction name and id if no instructions are found', () => {
      // Arrange
      const apiResponse = new ApiResponse<ParsingInfo>();
      const details = new ParsingInfo();
      apiResponse.details = details;
      const parsingInfo = autofixture.create(parsingInfoDefault);
      component.instructions = parsingInfo;

      // Act
      spyOn(parsingEngineService, 'getInstructions').and.returnValue(
        of(apiResponse.details)
      );
      component.getInstructions();
      fixture.detectChanges();

      // Assert
      expect(component.selectedInstruction.id).toEqual('');
      expect(component.selectedInstruction.name).toEqual('');
    });

    it('should have first instruction name and id if only one instruction is found', () => {
      // Arrange
      const apiResponse = new ApiResponse<ParsingInfo>();
      const details = new ParsingInfo();
      apiResponse.details = details;

      const selectedInstruction = autofixture.create(selectedInstructionDefault);
      component.selectedInstruction = selectedInstruction;
      const parsingInfo = autofixture.create(parsingInfoDefault);
      component.instructions = parsingInfo;

      // Act
      spyOn(parsingEngineService, 'getInstructions').and.returnValue(
        of(apiResponse.details)
      );
      component.getInstructions();
      fixture.detectChanges();

      // Assert
      expect(component.selectedInstruction.id).toEqual(selectedInstruction.id);
      expect(component.selectedInstruction.name).toEqual(selectedInstruction.name);
    });

    it('should have empty selected instruction name and id if multiple instructions are found', () => {
      // Arrange
      const apiResponse = new ApiResponse<ParsingInfo>();
      const details = new ParsingInfo();
      apiResponse.details = details;
      const instructions = autofixture.createMany(selectedInstructionDefault, 2);
      apiResponse.details.configs = instructions;

      // Act
      component.getInstructions();
      fixture.detectChanges();

      // Assert
      expect(component.selectedInstruction.id).toEqual('');
      expect(component.selectedInstruction.name).toEqual('');
    });
  });

  describe('verifyChange', () => {
    it('should have no errors when all conditions are met', () => {
      // Arrange
      const files = [
        {
          name: 'luke.skywalker.was.here.txt',
          size: 10000
        }
      ];

      // Act
      component.verifyChange(files);
      fixture.detectChanges();

      // Assert
      expect(component.fileErrorObject.code).toEqual('');
    });

    it('should have a file too large error when a large file is provided', () => {
      // Arrange
      const files = [
        {
          name: 'darth.vader.was.here.txt',
          size: 75000000
        }
      ];

      // Act
      component.verifyChange(files);
      fixture.detectChanges();

      // Assert
      expect(component.fileErrorObject.code).toEqual('6');
    });

    it('should have too many files error when more than 10 files are provided', () => {
      // Arrange
      const files = [
        {
          name: 'darth.vader.was.here.txt',
          size: 10000
        },
        {
          name: 'so.was.darth.maul.txt',
          size: 20000
        },
        {
          name: 'so.was.darth.maul.txt',
          size: 20000
        },
        {
          name: 'so.was.darth.maul.txt',
          size: 20000
        },
        {
          name: 'so.was.darth.maul.txt',
          size: 20000
        },
        {
          name: 'so.was.darth.maul.txt',
          size: 20000
        },
        {
          name: 'so.was.darth.maul.txt',
          size: 20000
        },
        {
          name: 'so.was.darth.maul.txt',
          size: 20000
        },
        {
          name: 'so.was.darth.maul.txt',
          size: 20000
        },
        {
          name: 'so.was.darth.maul.txt',
          size: 20000
        },
        {
          name: 'so.was.darth.maul.txt',
          size: 20000
        }
      ];

      // Act
      component.verifyChange(files);
      fixture.detectChanges();

      // Assert
      expect(component.fileErrorObject.code).toEqual('2');
    });

    it('should have a Large file size warning when a large file than minimum allowed size is provided', () => {
      // Arrange
      const files = [
        {
          name: 'darth.vader.was.here.txt',
          size: 20000000
        }
      ];

      // Act
      component.verifyChange(files);
      fixture.detectChanges();

      // Assert
      expect(component.hasWarning).toBeTruthy();
    });
  });

  describe('showBox', () => {
    it('should display default dialog box', () => {
      const showBoxId = '1';

      spyOn(component, 'showBox').and.callThrough();
      component.showBox(showBoxId);

      expect(component.isDefaultDialog).toBeTruthy();
      expect(component.isUploadInProgress).toBeFalsy();
      expect(component.isUploadSuccessful).toBeFalsy();
      expect(component.isMappingOrStatusDialog).toBeFalsy();
    });

    it('should display isUploadInProgress box', () => {
      const showBoxId = '2';

      spyOn(component, 'showBox').and.callThrough();
      component.showBox(showBoxId);


      expect(component.isUploadInProgress).toBeTruthy();
      expect(component.isDefaultDialog).toBeFalsy();
      expect(component.isUploadSuccessful).toBeFalsy();
      expect(component.isMappingOrStatusDialog).toBeFalsy();
    });

    it('should display isUploadSuccessful box', () => {
      const showBoxId = '3';

      spyOn(component, 'showBox').and.callThrough();
      component.showBox(showBoxId);

      expect(component.isUploadSuccessful).toBeTruthy();
      expect(component.isUploadInProgress).toBeFalsy();
      expect(component.isDefaultDialog).toBeFalsy();
      expect(component.isMappingOrStatusDialog).toBeFalsy();
    });

    it('should display isMappingOrStatusDialog box', () => {
      const showBoxId = '4';

      spyOn(component, 'showBox').and.callThrough();
      component.showBox(showBoxId);

      expect(component.isMappingOrStatusDialog).toBeTruthy();
      expect(component.isUploadSuccessful).toBeFalsy();
      expect(component.isUploadInProgress).toBeFalsy();
      expect(component.isDefaultDialog).toBeFalsy();
    });
  });

  // Enabling DateRange Filtering test cases
  describe('initFileUpload', () => {
    it('should have empty string in start and end dates when all-dates is selected', () => {
      // Arrange
      const blob = new Blob([''], { type: 'text/html' });
      blob['lastModifiedDate'] = '';
      blob['name'] = 'luke.was.here.txt';
      const file = <File>blob;
      component.fileList = {
        0: file,
        length: 2,
        item: (index: number) => file
      };
      component.dateType = allDates;

      // Act
      spyOn(component, 'processUpload').and.returnValue();
      component.initFileUpload();

      // Assert
      expect(component.startDatePickerValue).toEqual('');
      expect(component.endDatePickerValue).toEqual('');
    });

    it('should have values in start and end dates when all-dates is not selected', () => {
      // Arrange
      const blob = new Blob([''], { type: 'text/html' });
      blob['lastModifiedDate'] = '';
      blob['name'] = 'luke.was.here.txt';
      const file = <File>blob;
      component.fileList = {
        0: file,
        length: 2,
        item: (index: number) => file
      };
      component.dateType = dateRangeOpened;
      component.startDatePickerValue = new Date();
      component.endDatePickerValue = new Date();

      // Act
      spyOn(component, 'processUpload').and.returnValue();
      spyOn(component, 'adjustTime').and.returnValue();
      component.initFileUpload();

      // Assert
      expect(component.adjustTime).toHaveBeenCalled();
      expect(component.startDatePickerValue).toBeTruthy();
      expect(component.endDatePickerValue).toBeTruthy();
    });
  });

  it('should not display slideGen prompt if no instruction is present/selected', () => {
    component.instructionsCount = 0;
    component.isInstructionOkay = false;
    fixture.detectChanges();
    const slideGenPrompt = fixture.debugElement.nativeElement.querySelector('.spec-slidegen-prompt');
    expect(slideGenPrompt).toBeFalsy();
  });

  it('should not display slideGen prompt if the selected instruction is a "Vitros CD Transformer" type', () => {
    component.handlesSlideGen = true;
    fixture.detectChanges();
    const slideGenPrompt = fixture.debugElement.nativeElement.querySelector('.spec-slidegen-prompt');
    expect(slideGenPrompt).toBeFalsy();
  });

  it('should display slideGen prompt if the selected instruction is not a "Vitros CD Transformer" type', () => {
    component.instructionsCount = 2;
    component.handlesSlideGen = false;
    component.isInstructionOkay = true;
    fixture.detectChanges();
    const slideGenPrompt = fixture.debugElement.nativeElement.querySelector('.spec-slidegen-prompt');
    expect(slideGenPrompt).toBeTruthy();
  });

  it('should display "Upload" button by default or if "Yes" selected in slideGen prompt', () => {
    component.handlesSlideGen = false;
    fixture.detectChanges();
    component.updateSlidegenSelection('yes');
    expect(component.showUploadButton).toEqual(false);
    const slidegenUploadButton = fixture.debugElement.nativeElement.querySelector('.spec-slidegen-upload-button');
    const uploadButton = fixture.debugElement.nativeElement.querySelector('.spec-upload-button');
    expect(slidegenUploadButton).toBeTruthy();
    expect(uploadButton).toBeFalsy();
  });

  // This should be called with fakeAsync to run correctly.
  it('should display slideGen scheduler on click on "Upload" button', fakeAsync(() => {
    spyOn(component, 'displaySlideGenScheduler').and.callThrough();
    component.updateSlidegenSelection('yes');
    component.hasFile = true;
    component.slideGenPromptValue = 'yes';
    fixture.detectChanges();
    const slidegenUploadButton = fixture.debugElement.query(By.css('.spec-slidegen-upload-button'));
    slidegenUploadButton.nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      /// TODO: Ram has asked to resolve in a separate PR
     // expect(component.displaySlideGenScheduler).toHaveBeenCalled();
      expect(component.slideGenPromptValue).toEqual('yes');
    });
  }));

  it('should display "Upload" button if "No" selected in slideGen prompt', () => {
    component.handlesSlideGen = true;
    fixture.detectChanges();
    component.updateSlidegenSelection('no');
    expect(component.showUploadButton).toEqual(true);
    const uploadButton = fixture.debugElement.nativeElement.querySelector('.spec-upload-button');
    const slidegenUploadButton = fixture.debugElement.nativeElement.querySelector('.spec-slidegen-upload-button');
    expect(uploadButton).toBeTruthy();
    expect(slidegenUploadButton).toBeFalsy();
  });

});

