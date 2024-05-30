// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestBed } from '@angular/core/testing';

import { of, Observable } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';

import { ApiService } from '../../shared/api/api.service';
import { LabSetupService } from './lab-setup.service';
import { Lab } from '../../contracts/models/lab-setup/lab.model';
import { LabTree } from '../../contracts/models/lab-setup/lab-tree.model';
import { EntityType } from '../../contracts/enums/entity-type.enum';

let service: LabSetupService;
const autofixture = new Autofixture();
const postTestData = autofixture.create(new LabTree());
const getTestData = autofixture.create(new Lab());

const apiServiceSpy = {
  post: (): Observable<LabTree> => {
    return of(postTestData);
  },
  get: (): Observable<Lab> => {
    return of(getTestData);
  }
};

describe('LabSetupService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LabSetupService, { provide: ApiService, useValue: apiServiceSpy }]
    });

    service = TestBed.get(LabSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the lab directory url successfully', () => {
    spyOn(apiServiceSpy, 'post').and.returnValue(of(postTestData));
    service.getLabDirectory(EntityType.Account, '');
    expect(apiServiceSpy.post).toBeTruthy();
    expect(apiServiceSpy.post).toHaveBeenCalled();
  });

  it('should get the lab details by ID successfully', () => {
    spyOn(apiServiceSpy, 'get').and.returnValue(of(getTestData));
    service.getDetailsById(1);
    expect(apiServiceSpy.get).toBeTruthy();
    expect(apiServiceSpy.get).toHaveBeenCalled();
  });

});
