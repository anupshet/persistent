// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { TreePill } from '../../contracts/models/lab-setup';
import { TreeNodesService } from './tree-nodes.service';
import { ApiService } from '../api/api.service';
import { EntityTypeService } from './entity-type.service';
import { AppLoggerService } from './applogger/applogger.service';


describe('Shared TreeNodesService', () => {

  let service: TreeNodesService;

  const mockData: TreePill[] = [
    {
      displayName: 'Bagheerath B1 ',
      levelSettings: null,
      id: '02CA499C79054A5796BFD21C7196188F',
      parentNodeId: 'F99F194A193E4F808C12A18534988FD2',
      nodeType: 3,
      children: []
    },
    {
      displayName: 'Atharva HJ',
      levelSettings: null,
      id: '02CA499C79054A5796BFD21C7196188F',
      parentNodeId: 'F99F194A193E4F808C12A18534988FD2',
      nodeType: 3,
      children: []
    }
  ];

  class MockApiService { }
  class MockEntityTypeService { }
  class MockRouter { }
  const MockNgRedux = {
    select: () => {
      return { subscribe: () => { } };
    }
  };
  const authStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['Admin'],
      permissions: [],
      userData: {
        assignedLabNumbers: [],
        defaultLab: ''
      },
      accountNumber: '',
      accountId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
      labLocationId: '0d66767b-612c-4254-9eed-3a7ab393029f',
      labLocationIds: ['0d66767b-612c-4254-9eed-3a7ab393029f'],
      accountNumberArray: [],
      accessToken: '',
      id: 'eca89ea6-aba1-4b95-9396-0238352a4765',
      labId: ''
    },
    directory: {
      id: 10,
      name: 'Test',
      locations: null,
      children: [],
      primaryUnityLabNumbers: 'Test',
    }
  };
  const storeStub = {
    security: null,
    auth: authStub,
    userPreference: null,
    department: null,
    instrument: null,
    connectivity: null,
    router: null,
    navigation: null,
    location: null,
    dataManagement: null
  };
  class MockAppLoggerService { }

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [TreeNodesService,
        {
          provide: ApiService, useClass: MockApiService
        },
        {
          provide: EntityTypeService, useClass: MockEntityTypeService
        },
        {
          provide: Router, useClass: MockRouter
        },
        {
          provide: AppLoggerService, useClass: MockAppLoggerService
        },
        {
          provide: NgRedux, useValue: MockNgRedux
        },
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub })
      ]
    });

    service = TestBed.get(TreeNodesService);
  });

  afterEach(() => {
    service = null;
  });

  it('instance should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sort array with default key and order', () => {
    const sortedArray = service.sortByOrder(mockData);
    expect(sortedArray[0].displayName).toBe('Atharva HJ');
  });

});
