// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { of, Observable } from 'rxjs';

import { ApiService } from '../../shared/api/api.service';
import { ConfigService } from '../../core/config/config.service';
import { PortalApiService } from './portalApi.service';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { includeArchivedItems, nodeTypeNames } from '../../core/config/constants/general.const';
import { DuplicateControlRequest, DuplicateInstrumentRequest } from '../../contracts/models/lab-setup/duplicate-copy-request.model';
import { OperationType } from '../../contracts/enums/lab-setup/operation-type.enum';
import { LabInstrument, LabProduct, LabTest } from '../../contracts/models/lab-setup';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import { LevelLoadRequest } from '../../contracts/models/portal-api/labsetup-data.model';
import { LotRenewalPayload } from '../../contracts/models/actionable-dashboard/actionable-dashboard.model';
import { User, ContactInfo } from '../../contracts/models/user-management/user.model';
import { Account } from '../../contracts/models/account-management/account';
import { Lab } from '../../contracts/models/lab-setup/lab.model';
import { QueryParameter } from '../models/query-parameter';
import { Contact, UserPreference } from '../../contracts/models/portal-api/portal-data.model';
import { AccountSettings } from '../../contracts/models/lab-setup/account-settings.model';
import { Address } from '../../contracts/models/account-management/address.model';
import { TranslateService } from '@ngx-translate/core';
import { PayLoadWithAuditData, StartNewBrLotRequest } from '../../contracts/models/shared/duplicate-control-request.model';
import { AppNavigationTracking } from '../models/audit-tracking.model';

let service: PortalApiService;
let datePipe: DatePipe;
const labInstrumentId = 'sample-instrument-id';
const labDepartmentId = 'sample-department-id';
const labProductId = 'sample-product-id';
const labLocationId = 'sample-location-id';
const labTestId = 'sample-test-id';
const labTestIdArray = ['sample-test-id1', 'sample-test-id2', 'sample-test-id3'];
const labPanelId = 'sample-panel-id';
const labUserId = 'sample-user-id';
const labAccountId = 'sample-account-id';
const labId = 'sample-lab-id';

const reportId = ' sample-report-id';
const accountId = 'sample-account-id';
const duplicateControlRequest: DuplicateControlRequest[] = [{
  'parentNodes': [
    {
      'parentNodeId': 'c0becd14-dc06-4081-e9a5-a2e77ed7102a',
      'displayName': 'Dimension EXL-237781'
    }
  ],
  'nodeType': EntityType.LabProduct,
  'operationType': OperationType.Duplicate,
  'targetProductMasterLotId': 1006,
  'sourceNodeId': '7478883a-d231-4f96-bb5c-1709299c8931',
  'retainFixedCV': false
}];
const lotRenewalRequest: LotRenewalPayload = {
  id: '7478883a-d231-4f96-bb5c-1709299c8931',
  nodeType: EntityType.LabProduct,
  productMasterLotId: '123'
};
const duplicateInstrumentRequest: DuplicateInstrumentRequest[] = [{
  'parentNodes': [
    {
      'parentNodeId': '1ebecd14-dbfe-3a5b-f303-11cfd2f67ca4',
      'displayName': 'Lab',
      'targetEntityCustomName': '1'
    }
  ],
  'nodeType': EntityType.LabInstrument,
  'operationType': OperationType.Copy,
  'targetProductMasterLotId': 0,
  'sourceNodeId': 'c0becd14-dc06-4081-e9a5-a2e77ed7102a',
  'retainFixedCV': true
}];
const nodeUser = {
  'id': 'd4ef454c-069c-46d8-82ad-0c45885b588e',
  'children': null,
  'nodeType': EntityType.User,
  'parentNodeId': '14a5d14d-46d3-495d-b396-8b48315b45f6',
  'displayName': 'Divya Lalwani'
};
const nodeDepartment = {
  'id': '83ea7836-18e8-4d14-be38-384ef6236208',
  'children': null,
  'nodeType': EntityType.LabDepartment,
  'parentNodeId': '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
  'displayName': 'dept1'
};
const nodeInstrument: LabInstrument[] = [{
  'parentNodeId': '83ea7836-18e8-4d14-be38-384ef6236208',
  'instrumentCustomName': '',
  'instrumentId': '3115',
  'manufacturerId': '1',
  'instrumentSerial': '',
  'nodeType': EntityType.LabInstrument,
  'children': null,
  'displayName': 'Alinity c',
  'id': '517fb55c-1797-47c3-b5d2-0eeda5cf577d',
  'instrumentInfo': {
    'id': 3115,
    'name': 'Alinity c',
    'manufacturerId': '1',
    'manufacturerName': 'Abbott'
  }
}];
const nodeProduct: LabProduct[] = [{
  'nodeType': EntityType.LabProduct,
  'manufacturerId': '2',
  'productId': '1',
  'productMasterLotId': '1086',
  'productCustomName': '',
  'parentNodeId': '517fb55c-1797-47c3-b5d2-0eeda5cf577d',
  'children': null,
  'id': '37e004ae-2172-4c3c-a807-aca9c7148614',
  'displayName': 'Anemia'
}];
const nodeTest: LabTest[] = [{
  'nodeType': EntityType.LabTest,
  'testSpecId': '5219',
  'testId': '5201',
  'labUnitId': '53',
  'parentNodeId': '37e004ae-2172-4c3c-a807-aca9c7148614',
  'correlatedTestSpecId': 'E41CC3FFE5134BC4B76884E88132CBBF',
  'id': 'eea212b2-ee3f-47b5-8767-ae74645c8d04',
  'children': null,
  'displayName': 'Iron',
  'testSpecInfo': {
    'id': 5219,
    'testId': 5201,
    'analyteStorageUnitId': 98,
    'analyteId': 104,
    'analyteName': 'Iron',
    'methodId': 105,
    'methodName': 'Ferene',
    'instrumentId': 3115,
    'instrumentName': 'Alinity c',
    'reagentId': 2201,
    'reagentManufacturerId': null,
    'reagentManufacturerName': 'Abbott',
    'reagentName': 'Iron REF 08P39',
    'reagentLotId': 1512,
    'reagentLotNumber': 'Unspecified ***',
    'reagentLot': {
      'id': 1512,
      'reagentCategory': 1,
      'reagentId': 2201,
      'lotNumber': 'Unspecified ***',
      'shelfExpirationDate': new Date('2069-05-24T14:38:31.17')
    },
    'storageUnitId': 13,
    'storageUnitName': 'µg/dL',
    'calibratorId': 785,
    'calibratorManufacturerId': null,
    'calibratorManufacturerName': 'Abbott',
    'calibratorName': 'Iron Cal REF 04U7501',
    'calibratorLotId': 787,
    'calibratorLotNumber': 'Unspecified ***',
    'calibratorLot': {
      'id': 787,
      'calibratorId': 785,
      'lotNumber': 'Unspecified ***',
      'shelfExpirationDate': new Date('2069-05-24T14:38:31.17')
    }
  },
}];

const timeStampValue = '2022082608444901';

const apiServiceSpy = {
  post: (path: string, data: any, showAsBusy?: boolean): Observable<any> => {
    return of({});
  },
  get: (path: string, responseType?: string, showAsBusy?: boolean): Observable<any> => {
    return of({});
  },
  del: (path: string, showAsBusy?: boolean): Observable<any> => {
    return of({});
  },
  delWithData: (url: string, data: any, showAsBusy?: boolean): Observable<any> => {
    return of({});
  },
  getWithError: (path: string, responseType?: string, showAsBusy?: boolean): Observable<any> => {
    return of({});
  }
};

const ConfigServiceStub = {
  getConfig: (string): string => {
    return 'result';
  }
};

describe('PortalApiService', () => {
  const State = [];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NgReduxTestingModule,
        StoreModule.forRoot(State)
      ],
      providers: [
        DatePipe,
        PortalApiService,
        { provide: TranslateService, useValue: { get: tag => of(tag) } },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ConfigService, useValue: ConfigServiceStub }
      ]
    });

    service = TestBed.inject(PortalApiService);
    datePipe = TestBed.inject(DatePipe);

    // Resolves intermittent URL timestamp comparison mismatch in tests due to timing.
    spyOn(datePipe, 'transform').and.returnValue(timeStampValue);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should pass the correct request URL to the API for getting ancestors of a single node', () => {
    spyOn(service, 'get').and.returnValue(of({}));
    service.getLabSetupAncestors(EntityType.LabInstrument, labInstrumentId);
    expect(service.get).
      toHaveBeenCalledOnceWith(`labsetup/ancestors/${nodeTypeNames[EntityType.LabInstrument]}/${labInstrumentId}`, null, true);
  });

  it('should pass the correct request URL and payload to the API for getting ancestors of a multiple nodes', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    service.getLabSetupAncestorsMultiple(EntityType.LabTest, labTestIdArray);
    expect(service.post).
      toHaveBeenCalledOnceWith(`labsetup/ancestors/${nodeTypeNames[EntityType.LabTest]}`, labTestIdArray, true);
  });

  it('should pass the correct request URL and payload to the API for duplicating a product lot', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    service.duplicateLabProductNode(lotRenewalRequest, true, labInstrumentId);
    expect(service.post).
      toHaveBeenCalledOnceWith(`labsetup/duplicate/${nodeTypeNames[EntityType.LabProduct]}?children=true&parentNodeId=${labInstrumentId}`, lotRenewalRequest);
  });

  it('should pass the correct request URL to the API for duplication of a instrument.', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    service.duplicateNode(EntityType.LabInstrument, duplicateInstrumentRequest);
    expect(service.post).
      toHaveBeenCalledOnceWith(`labsetup/duplicate-nodes/${nodeTypeNames[EntityType.LabInstrument]}`, duplicateInstrumentRequest, true);
  });

  it('should pass the correct request URL to the API for duplication of a lot.', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    service.duplicateNode(EntityType.LabProduct, duplicateControlRequest);
    expect(service.post).
      toHaveBeenCalledOnceWith(`labsetup/duplicate-nodes/${nodeTypeNames[EntityType.LabProduct]}`, duplicateControlRequest, true);
  });

  it('should pass the correct request URL to the API for deleting a department', () => {
    spyOn(service, 'del').and.returnValue(of({}));
    service.deleteLabSetupNode(EntityType.LabDepartment, labDepartmentId);
    expect(service.del).toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.LabDepartment]}/${labDepartmentId}`, true);
  });

  it('should pass the correct request URL to the API for deleting a instrument', () => {
    spyOn(service, 'del').and.returnValue(of({}));
    service.deleteLabSetupNode(EntityType.LabInstrument, labInstrumentId);
    expect(service.del).toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.LabInstrument]}/${labInstrumentId}`, true);
  });

  it('should pass the correct request URL to the API for deleting a control', () => {
    spyOn(service, 'del').and.returnValue(of({}));
    service.deleteLabSetupNode(EntityType.LabProduct, labProductId);
    expect(service.del).toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.LabProduct]}/${labProductId}`, true);
  });

  it('should pass the correct request URL to the API for deleting a analyte', () => {
    spyOn(service, 'del').and.returnValue(of({}));
    service.deleteLabSetupNode(EntityType.LabTest, labTestId);
    expect(service.del).toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.LabTest]}/${labTestId}`, true);
  });

  it('should pass the correct request URL to the API for deleting a panel', () => {
    spyOn(service, 'del').and.returnValue(of({}));
    service.deleteLabSetupNode(EntityType.Panel, labPanelId);
    expect(service.del).toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.Panel]}/${labPanelId}`, true);
  });

  it('should pass the correct request URL to the API for deleting a user', () => {
    spyOn(service, 'del').and.returnValue(of({}));
    service.deleteLabSetupNode(EntityType.User, labUserId);
    expect(service.del).toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.User]}/${labUserId}`, true);
  });

  it('should pass the correct request URL to the API for adding and editing a user', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    service.upsertLabSetupNode(nodeUser, EntityType.User, true);
    expect(service.post).toHaveBeenCalledOnceWith(`labsetup/v2/${nodeTypeNames[EntityType.User]}`, nodeUser, true);
  });

  it('should pass the correct request URL to the API for adding a department', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    service.upsertLabSetupNode(nodeDepartment, EntityType.LabDepartment);
    expect(service.post).toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.LabDepartment]}`, nodeDepartment, true);
  });

  it('should pass the correct request URL to the API for adding and editing a instrument', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    service.upsertLabSetupNodeBatch(nodeInstrument, EntityType.LabInstrument);
    expect(service.post).toHaveBeenCalledOnceWith(`labsetup/batch/${nodeTypeNames[EntityType.LabInstrument]}`, nodeInstrument, true);
  });

  it('should pass the correct request URL to the API for adding and editing a control', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    service.upsertLabSetupNodeBatch(nodeProduct, EntityType.LabProduct);
    expect(service.post).toHaveBeenCalledOnceWith(`labsetup/batch/${nodeTypeNames[EntityType.LabProduct]}`, nodeProduct, true);
  });

  it('should pass the correct request URL to the API for adding and editing a analyte', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    service.upsertLabSetupNodeBatch(nodeTest, EntityType.LabTest);
    expect(service.post).toHaveBeenCalledOnceWith(`labsetup/batch/${nodeTypeNames[EntityType.LabTest]}`, nodeTest, true);
  });

  it('should pass the correct request URL to the API for navigating to the reports tab', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    const _includeArchivedItems = 'true';
    service.getGrandChildren(EntityType.LabInstrument, reportId, _includeArchivedItems);
    expect(service.post).toHaveBeenCalledOnceWith(`labsetup/get-tree-node/${nodeTypeNames[EntityType.LabInstrument]}?LoadChildren=${urlPlaceholders.loadUpToGrandchildren}&LoadTestSettings=True&${includeArchivedItems}=${_includeArchivedItems}&IncludeAllTestSpecIds=true`, { nodeId: reportId }, true);
  });

/*   it('should pass the correct request URL to the API for getting expired Lots', () => {
    spyOn(service, 'get').and.returnValue(of({}));
    service.getExpiredLots();
    expect(service.get).toHaveBeenCalledOnceWith(`labsetup/expiredLots`, null, false);
  }); */

  it('should pass the correct request URL to the API for getting allowed Roles', () => {
    spyOn(service, 'get').and.returnValue(of({}));
    service.getAllowedRoles();
    expect(service.get).toHaveBeenCalledOnceWith(`labsetup/allowedUserRoles`, null, false);
  });

  it('should pass the correct request URL to the API for creating new Product lot', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    const node = new LotRenewalPayload();
    node.nodeType = EntityType.LabProduct;
    service.duplicateLabProductNode(node, true, labInstrumentId);
    expect(service.post).toHaveBeenCalledOnceWith(`labsetup/duplicate/${nodeTypeNames[EntityType.LabProduct]}?children=true&parentNodeId=${labInstrumentId}`, node);
  });

  it('should pass the correct request URL to the API for searching lab setup node', () => {
    spyOn(service, 'get').and.returnValue(of({}));
    const searchString = 'sample-Okta-id';
    service.searchLabSetupNode(User, searchString);
    expect(service.get).toHaveBeenCalledOnceWith(`labsetup/v2/search/${EntityType[EntityType.User]}/${searchString}`, null, true);
  });

  it('should pass the correct request URL to the API for listing lab setup node and children', () => {
    spyOn(service, 'get').and.returnValue(of({}));
    service.listLabSetupNodeAndChildren(Account, Lab);
    expect(service.get).toHaveBeenCalledOnceWith(`labsetup/list/${EntityType[EntityType.Account]}?LoadChildren=LoadChildren&ChildFilter=${EntityType.Lab}`
      , null, true);
  });

  it('should pass the correct request URL to the API for listing lab setup node for product', () => {
    spyOn(service, 'get').and.returnValue(of({}));
    const expirationDayLimit = 'sample-expirationDayLimit';
    const queryParameters: QueryParameter[] = [
      new QueryParameter(urlPlaceholders.hasAncestor, accountId),
      new QueryParameter(urlPlaceholders.loadParent, urlPlaceholders.loadParent),
      new QueryParameter('FilterExpiredProductLots', expirationDayLimit)
    ];
    service.listLabSetupNode(LabProduct, queryParameters);
    const url = `labsetup/list/${EntityType[EntityType.LabProduct]}?${urlPlaceholders.hasAncestor}=${accountId}&${urlPlaceholders.loadParent}=${urlPlaceholders.loadParent
      }&FilterExpiredProductLots=${expirationDayLimit}`;
    expect(service.get).toHaveBeenCalledOnceWith(url, null, true);
  });

  it('should pass the correct request URL to the API for listing lab setup node for instrument', () => {
    spyOn(service, 'get').and.returnValue(of({}));
    const queryParameters: QueryParameter[] = [
      new QueryParameter(urlPlaceholders.hasAncestor, accountId),
      new QueryParameter(urlPlaceholders.loadChildren, urlPlaceholders.loadAllDescendants)
    ];
    service.listLabSetupNode(LabInstrument, queryParameters);
    const url = `labsetup/list/${EntityType[EntityType.LabInstrument]}?${urlPlaceholders.hasAncestor}=${accountId}&${urlPlaceholders.loadChildren}=${urlPlaceholders.loadAllDescendants}`;
    expect(service.get).toHaveBeenCalledOnceWith(url, null, true);
  });

  it('should pass the correct request URL to the API for adding portal data', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    // Edit user, Add user
    const newContactInfo = new ContactInfo();
    service.upsertPortalData(newContactInfo);
    expect(service.post).toHaveBeenCalledWith(`portaldata`, newContactInfo, true);

    // Upsert address
    const address = new Address();
    service.upsertPortalData(address);
    expect(service.post).toHaveBeenCalledWith(`portaldata`, address, true);

    // Upsert contact
    const contact = new Contact();
    service.upsertPortalData(contact);
    expect(service.post).toHaveBeenCalledWith(`portaldata`, contact, true);

    // Upsert User-Preference
    const userPrefSubmit = new UserPreference();
    service.upsertPortalData(userPrefSubmit);
    expect(service.post).toHaveBeenCalledWith(`portaldata`, userPrefSubmit, true);
  });

  it('should pass the correct request URL to the API for deleting portal data', () => {
    spyOn(service, 'delWithData').and.returnValue(of({}));
    const newContactInfo = new ContactInfo();
    service.deletePortalData(newContactInfo);
    expect(service.delWithData).toHaveBeenCalledOnceWith(`portaldata`, newContactInfo, true);
  });

  it('should pass the correct request URL to the API for saving default Lab setup', () => {
    spyOn(service, 'put').and.returnValue(of({}));
    const accountSettings = new AccountSettings();
    service.saveLabsetupDefaults(accountSettings);
    expect(service.put).toHaveBeenCalledOnceWith(`labsetup/account-settings`, accountSettings, true);
  });

  /* for LabSetupNode  get*/
  it('should pass the correct request URL to the API for getting LabSetupNode for Account NodeType', () => {
    const dateTimeStamp = new Date();
    const date = datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    spyOn(service, 'getWithError').and.returnValue(of({}));
    service.getLabSetupNode(EntityType.Account, labAccountId, LevelLoadRequest.LoadChildren, EntityType.Account);
    expect(service.getWithError).
      toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.Account]}/${labAccountId}?v=${date}&LoadChildren=LoadChildren&ChildFilter=${EntityType.Account}`, null, true);
  });

  it('should pass the correct request URL to the API for getting LabSetupNode for Instrument NodeType', () => {
    const dateTimeStamp = new Date();
    const date = datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    spyOn(service, 'getWithError').and.returnValue(of({}));
    service.getLabSetupNode(EntityType.LabInstrument, labInstrumentId, LevelLoadRequest.LoadChildren, EntityType.LabInstrument);
    expect(service.getWithError).
      toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.LabInstrument]}/${labInstrumentId}?v=${date}&LoadChildren=LoadChildren&ChildFilter=${EntityType.LabInstrument}`, null, true);
  });

  it('should pass the correct request URL to the API for getting LabSetupNode for Product/Control NodeType', () => {
    const dateTimeStamp = new Date();
    const date = datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    spyOn(service, 'getWithError').and.returnValue(of({}));
    service.getLabSetupNode(EntityType.LabProduct, labProductId, LevelLoadRequest.LoadChildren, EntityType.LabProduct);
    expect(service.getWithError).
      toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.LabProduct]}/${labProductId}?v=${date}&LoadChildren=LoadChildren&ChildFilter=${EntityType.LabProduct}`, null, true);
  });

  it('should pass the correct request URL to the API for getting LabSetupNode for Test/Analyte NodeType', () => {
    const dateTimeStamp = new Date();
    const date = datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    spyOn(service, 'getWithError').and.returnValue(of({}));
    service.getLabSetupNode(EntityType.LabTest, labTestId, LevelLoadRequest.LoadChildren, EntityType.LabTest);
    expect(service.getWithError).
      toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.LabTest]}/${labTestId}?v=${date}&LoadChildren=LoadChildren&ChildFilter=${EntityType.LabTest}`, null, true);
  });

  it('should pass the correct request URL to the API for getting LabSetupNode for Department NodeType', () => {
    const dateTimeStamp = new Date();
    const date = datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    spyOn(service, 'getWithError').and.returnValue(of({}));
    service.getLabSetupNode(EntityType.LabDepartment, labDepartmentId, LevelLoadRequest.LoadChildren, EntityType.LabDepartment);
    expect(service.getWithError).
      toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.LabDepartment]}/${labDepartmentId}?v=${date}&LoadChildren=LoadChildren&ChildFilter=${EntityType.LabDepartment}`, null, true);
  });

  it('should pass the correct request URL to the API for getting LabSetupNode for Location NodeType', () => {
    const dateTimeStamp = new Date();
    const date = datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    spyOn(service, 'getWithError').and.returnValue(of({}));
    service.getLabSetupNode(EntityType.LabLocation, labLocationId, LevelLoadRequest.LoadChildren, EntityType.LabLocation);
    expect(service.getWithError).
      toHaveBeenCalledOnceWith(`labsetup/v2/${nodeTypeNames[EntityType.LabLocation]}/${labLocationId}?v=${date}&LoadChildren=LoadChildren&ChildFilter=${EntityType.LabLocation}`, null, true);
  });

  it('should pass the correct request URL to the API for getting LabSetupNode for User NodeType', () => {
    const dateTimeStamp = new Date();
    const date = datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    spyOn(service, 'getWithError').and.returnValue(of({}));
    service.getLabSetupNode(EntityType.User, labUserId, LevelLoadRequest.LoadChildren, EntityType.User);
    expect(service.getWithError).
      toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.User]}/${labUserId}?v=${date}&LoadChildren=LoadChildren&ChildFilter=${EntityType.User}`, null, true);
  });

  it('should pass the correct request URL to the API for getting LabSetupNode for Panel NodeType', () => {
    const dateTimeStamp = new Date();
    const date = datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    spyOn(service, 'getWithError').and.returnValue(of({}));
    service.getLabSetupNode(EntityType.Panel, labPanelId, LevelLoadRequest.LoadChildren, EntityType.Panel);
    expect(service.getWithError).
      toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.Panel]}/${labPanelId}?v=${date}&LoadChildren=LoadChildren&ChildFilter=${EntityType.Panel}`, null, true);
  });

  it('should pass the correct request URL to the API for getting LabSetupNode for Account Settings NodeType', () => {
    const dateTimeStamp = new Date();
    const date = datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    spyOn(service, 'getWithError').and.returnValue(of({}));
    service.getLabSetupNode(EntityType.AccountSettings, labAccountId, LevelLoadRequest.LoadChildren, EntityType.AccountSettings);
    expect(service.getWithError).
      toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.AccountSettings]}/${labAccountId}?v=${date}&LoadChildren=LoadChildren&ChildFilter=${EntityType.AccountSettings}`, null, true);
  });

  it('should pass the correct request URL to the API for getting LabSetupNode for Lab/Group NodeType', () => {
    const dateTimeStamp = new Date();
    const date = datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    spyOn(service, 'getWithError').and.returnValue(of({}));
    service.getLabSetupNode(EntityType.Lab, labId, LevelLoadRequest.LoadChildren, EntityType.Lab);
    expect(service.getWithError).
      toHaveBeenCalledOnceWith(`labsetup/${nodeTypeNames[EntityType.Lab]}/${labId}?v=${date}&LoadChildren=LoadChildren&ChildFilter=${EntityType.Lab}`, null, true);
  });

  it('should pass the correct request URL to the API for creating new non BioRad lot', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    const requestPayload: PayLoadWithAuditData<StartNewBrLotRequest[]>
      = { data: [new StartNewBrLotRequest()], audit: {} as AppNavigationTracking };
    service.postNonBrMasterLotDefinition(requestPayload);
    expect(service.post).toHaveBeenCalledOnceWith('labsetup/product/nbr/masterlot', requestPayload, true);
  });
});
