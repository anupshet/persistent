// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestBed } from '@angular/core/testing';

import { of, Observable } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';

import { ApiService } from '../../shared/api/api.service';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { UserManagementService } from './user-management.service';
import { UserManagementApiService } from '../api/userManagementApi.service';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TreePill } from '../../contracts/models/lab-setup';

let service: UserManagementService;
const autofixture = new Autofixture();
const testData = autofixture.create(new TreePill());

const apiServiceSpy = {
  post: (): Observable<TreePill> => {
    return of(testData);
  },
  get: (): Observable<TreePill> => {
    return of(testData);
  },
  put: (): Observable<TreePill> => {
    return of(testData);
  }
};

const userManagementApiServiceMock = {
  getRawDataPageByLabTestId: () => of([]).toPromise()
};

const mockUserRequest = {
  firstName: 'test',
  lastName: 'Ltest',
  email: 'test@bio-rad.com',
  userRoles: ['LeadTechnician'],
  groups: []
};

describe('UserManagementService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot([])],
      providers: [UserManagementService, { provide: ApiService, useValue: apiServiceSpy },
        { provide: UserManagementApiService, useValue: userManagementApiServiceMock },
        { provide: Store, useValue: [] },
        provideMockStore({})]
    });

    service = TestBed.get(UserManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post add user data successfully', () => {
    spyOn(apiServiceSpy, 'post').and.returnValue(of(testData));
    service.updateUser(mockUserRequest, EntityType.Account);
    expect(apiServiceSpy.post).toBeTruthy();
    expect(apiServiceSpy.post).toHaveBeenCalled();
  });
});
