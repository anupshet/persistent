// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestBed, inject } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { NavSideBarService } from './nav-side-bar.service';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { AppNavigationTrackingService } from '../../services/appNavigationTracking/app-navigation-tracking.service';
import { HttpLoaderFactory } from '../../../app.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('NavSideBarService', () => {
  let navSideBarService: NavSideBarService;
  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    comparePriorAndCurrentValues:() => {}
  };

  beforeEach(() => TestBed.configureTestingModule({
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
    providers: [
      NavSideBarService,
      { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
      NavSideBarService,
      TranslateService,
      HttpClient
    ]

  }));

  beforeEach(inject(
    [NavSideBarService],
    (_service: NavSideBarService) => {
      navSideBarService = _service;
    }
  ));

  it('should be created', () => {
    const service: NavSideBarService = TestBed.get(NavSideBarService);
    expect(service).toBeTruthy();
  });

  it('should display the instrument Custom Name when invoked with Lab Instrument', () => {
    const labInstrument = {
      displayName: 'RealInstrument',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF41',
      id: '9EP6887F76AE485AAFE3FCFD2150AF97',
      type: EntityType.LabInstrument,
      isSummary: false,
      label: '',
      nodeType: 4,
      nodeEntityId: '2',
      instrumentCustomName: 'TestCustomName',
      instrumentInfo: {
        name: 'AU 5400'
      },
      children: []
    };

    const sideBarItems = navSideBarService.getSideBarItems([labInstrument]);
    expect(sideBarItems.length).toEqual(1);
    expect(sideBarItems[0].primaryText).toEqual(labInstrument.instrumentCustomName);
    expect(sideBarItems[0].additionalText).toEqual(labInstrument.instrumentInfo.name);
  });

  it('should display calibrator when invoked with analyte(test)s having same name different calibrator', () => {
    const labAnalytes = [{
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF41',
      id: '8E06887F76AE485AAFE3FCFD2150AF87',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 213,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        calibratorId: '15000',
        calibratorName: 'Cal 123'
      }
    }, {
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF42',
      id: '8E06887F76AE485AAFE3FCFD2150AF88',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 214,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        calibratorId: '25000',
        calibratorName: 'Cal 456'
      }
    }];

    const sideBarItems = navSideBarService.getSideBarItems(labAnalytes);
    expect(sideBarItems.length).toEqual(labAnalytes.length);
    expect(sideBarItems[0].primaryText).toEqual(labAnalytes[0].displayName);
    expect(sideBarItems[0].additionalText).toContain(labAnalytes[0].testSpecInfo.calibratorName);
  });

  it('should display reagent when invoked with analyte(test)s having same name but different reagent', () => {
    const labAnalytes = [{
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF41',
      id: '8E06887F76AE485AAFE3FCFD2150AF87',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 213,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        reagentId: '1001',
        reagentName: 'Reagent A'
      }
    }, {
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF42',
      id: '8E06887F76AE485AAFE3FCFD2150AF88',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 214,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        reagentId: '1002',
        reagentName: 'Reagent B'
      }
    }];

    const sideBarItems = navSideBarService.getSideBarItems(labAnalytes);
    expect(sideBarItems.length).toEqual(labAnalytes.length);
    expect(sideBarItems[0].primaryText).toEqual(labAnalytes[0].displayName);
    expect(sideBarItems[0].additionalText).toContain(labAnalytes[0].testSpecInfo.reagentName);
  });

  it('should display method and reagent when invoked with analyte(test)s having same name but different methods and reagents', () => {
    const labAnalytes = [{
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF41',
      id: '8E06887F76AE485AAFE3FCFD2150AF87',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 213,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        methodId: '1',
        methodName: 'M1',
        reagentId: '1001',
        reagentName: 'RA'
      }
    }, {
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF42',
      id: '8E06887F76AE485AAFE3FCFD2150AF88',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 214,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        methodId: '1',
        methodName: 'M1',
        reagentId: '1002',
        reagentName: 'RB'
      }
    }, {
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF41',
      id: '8E06887F76AE488AAFE3FCFD2150AF87',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 213,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        methodId: '2',
        methodName: 'M2',
        reagentId: '1001',
        reagentName: 'RA'
      }
    }, {
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF42',
      id: '8E06887F76AE485AAFE3FC8D2150AF88',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 214,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        methodId: '2',
        methodName: 'M2',
        reagentId: '1002',
        reagentName: 'RB'
      }
    }];

    const sideBarItems = navSideBarService.getSideBarItems(labAnalytes);
    expect(sideBarItems.length).toEqual(labAnalytes.length);

    sideBarItems.forEach((analyteSideBarItem, i) => {
      expect(analyteSideBarItem.primaryText).toEqual(labAnalytes[i].displayName);
      expect(analyteSideBarItem.additionalText).toEqual(navSideBarService.getTranslations('TRANSLATION.METHOD') + labAnalytes[i].testSpecInfo.methodName
        + navSideBarService.getTranslations('TRANSLATION.REAGENT') + labAnalytes[i].testSpecInfo.reagentName);
    });
  });

  it('should display reagent lots when invoked with analyte(test)s having same name but different reagent lots', () => {
    const labAnalytes = [{
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF41',
      id: '8E06887F76AE485AAFE3FCFD2150AF87',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 213,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        reagentId: 1001,
        reagentName: 'RA',
        reagentLotId: 1080,
        reagentLot: {
          lotNumber: 'RL1080'
        },
        calibratorId: 1001,
        calibratorName: 'C1',
        calibratorLotId: 105,
        calibratorLot: {
          lotNumber: 'CL105'
        }
      }
    }, {
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF42',
      id: '8E06887F76AE485AAFE3FCFD2150AF88',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 213,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        reagentId: 1001,
        reagentName: 'RA',
        reagentLotId: 1090,
        reagentLot: {
          lotNumber: 'RL1090'
        },
        calibratorId: 1001,
        calibratorName: 'C1',
        calibratorLotId: 105,
        calibratorLot: {
          lotNumber: 'CL105'
        }
      }
    }, {
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF42',
      id: '8E06887F76AE485AAFE3FC8D2150AF91',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 213,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        reagentId: 1001,
        reagentName: 'RA',
        reagentLotId: 2090,
        reagentLot: {
          lotNumber: 'RL2090'
        },
        calibratorId: 1001,
        calibratorName: 'C1',
        calibratorLotId: 105,
        calibratorLot: {
          lotNumber: 'CL105'
        }
      }
    }];

    const sideBarItems = navSideBarService.getSideBarItems(labAnalytes);
    expect(sideBarItems.length).toEqual(labAnalytes.length);

    sideBarItems.forEach((analyteSideBarItem, i) => {
      expect(analyteSideBarItem.primaryText).toEqual(labAnalytes[i].displayName);
      expect(analyteSideBarItem.additionalText).toEqual(navSideBarService.getTranslations('TRANSLATION.REAGENTLOT') + labAnalytes[i].testSpecInfo.reagentLot.lotNumber);
    });
  });

  it('should display calibrator lots when invoked with analyte(test)s having same name but different calibrator lots', () => {
    const labAnalytes = [{
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF41',
      id: '8E06887F76AE485AAFE3FCFD2150AF87',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 213,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        reagentId: 1001,
        reagentName: 'RA',
        reagentLotId: 1080,
        reagentLot: {
          lotNumber: 'RL1080'
        },
        calibratorId: 1001,
        calibratorName: 'C1',
        calibratorLotId: 105,
        calibratorLot: {
          lotNumber: 'CL105'
        }
      }
    }, {
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF42',
      id: '8E06887F76AE485AAFE3FCFD2150AF88',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 213,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        reagentId: 1001,
        reagentName: 'RA',
        reagentLotId: 1080,
        reagentLot: {
          lotNumber: 'RL1080'
        },
        calibratorId: 1001,
        calibratorName: 'C1',
        calibratorLotId: 110,
        calibratorLot: {
          lotNumber: 'CL110'
        }
      }
    }, {
      displayName: 'labTest',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF42',
      id: '8E06887F76AE485AAFE3FC8D2150AF91',
      type: EntityType.LabTest,
      isSummary: false,
      label: '',
      nodeType: 6,
      nodeEntityId: '6',
      children: null,
      lotNumber: '',
      testSpecInfo: {
        id: 213,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        reagentId: 1001,
        reagentName: 'RA',
        reagentLotId: 1080,
        reagentLot: {
          lotNumber: 'RL1080'
        },
        calibratorId: 1001,
        calibratorName: 'C1',
        calibratorLotId: 120,
        calibratorLot: {
          lotNumber: 'CL120'
        }
      }
    }];

    const sideBarItems = navSideBarService.getSideBarItems(labAnalytes);
    expect(sideBarItems.length).toEqual(labAnalytes.length);

    sideBarItems.forEach((analyteSideBarItem, i) => {
      expect(analyteSideBarItem.primaryText).toEqual(labAnalytes[i].displayName);
      expect(analyteSideBarItem.additionalText).toEqual(navSideBarService.getTranslations('TRANSLATION.CALIBRATORLOT1') + labAnalytes[i].testSpecInfo.calibratorLot.lotNumber);
    });
  });

  it('should display lot number when invoked with Lab Control(Product) with custom name', () => {
    const labControl = {
      displayName: 'My Control 1',
      productCustomName: 'My Control 1',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF41',
      id: '8E06887F76AE485AAFE3FCFD2150AF87',
      type: EntityType.LabProduct,
      isSummary: false,
      label: '',
      nodeType: 5,
      nodeEntityId: '5',
      children: null,
      lotNumber: '',
      productInfo: {
        id: 243,
        name: 'Microalbumin',
        manufacturerId: 2,
        manufacturerName: 'Bio-Rad"',
        matrixId: 5,
        matrixName: 'Urine'
      },
      lotInfo: {
        id: 213,
        productId: 405,
        name: 'Diabetes (Liquichek Vista)',
        lotNumber: '28570w'
      }
    };

    const sideBarItems = navSideBarService.getSideBarItems([labControl]);
    expect(sideBarItems.length).toEqual(1);
    expect(sideBarItems[0].primaryText).toEqual(labControl.productCustomName);
    expect(sideBarItems[0].secondaryText).toEqual(labControl.productInfo.name);
    expect(sideBarItems[0].additionalText).toContain(labControl.lotInfo.lotNumber);
  });

  it('should not display lot number when invoked with Lab Control(Product) without custom name', () => {
    const labControl = {
      displayName: 'Microalbumin',
      parentNodeId: '8D06887F76AE485AAFE3FCFD2150AF41',
      id: '8E06887F76AE485AAFE3FCFD2150AF87',
      type: EntityType.LabProduct,
      isSummary: false,
      label: '',
      nodeType: 5,
      nodeEntityId: '5',
      children: null,
      lotNumber: '',
      productInfo: {
        id: 243,
        name: 'Microalbumin',
        manufacturerId: 2,
        manufacturerName: 'Bio-Rad"',
        matrixId: 5,
        matrixName: 'Urine'
      },
      lotInfo: {
        id: 213,
        productId: 405,
        name: 'Diabetes (Liquichek Vista)',
        lotNumber: '28570w'
      }
    };

    const sideBarItems = navSideBarService.getSideBarItems([labControl]);
    expect(sideBarItems.length).toEqual(1);
    expect(sideBarItems[0].primaryText).toEqual(labControl.productInfo.name);
    expect(sideBarItems[0].secondaryText).toEqual('');
    expect(sideBarItems[0].additionalText).toContain(labControl.lotInfo.lotNumber);
  });

});
