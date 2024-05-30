// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { NgReduxModule } from '@angular-redux/store';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MaterialModule, InfoTooltipComponent } from 'br-component-library';
import { of } from 'rxjs';

import { InstructionsComponent } from './instructions.component';


import { InstructionsService } from '../instructions/instructions.service';
import { ParsingEngineAdapterService } from '../instructions/parsing-engine/parsing-engine-adapter.service';
import { ParsingEngineService } from '../../../shared/services/parsing-engine.service';
import { ParsingEngineApiService } from '../../../shared/api/parsingEngineApi.service';
import { ConfigService } from '../../../core/config/config.service';
import { AppLoggerService } from '../../../shared/services/applogger/applogger.service';
import { ActivatedRouteStub } from '../../../../testing/activated-route-stub';

@Component({ selector: 'unext-connectivity-header', template: '' })
class HeaderStubComponent {}

@Component({ selector: 'router-outlet', template: '' }) // tslint:disable-line
class RouterOutletStubComponent {}

describe('InstructionsComponent', () => {
  let component: InstructionsComponent;
  let fixture: ComponentFixture<InstructionsComponent>;
  const activatedRouteStub = new ActivatedRouteStub(null, { id: '1' });
  const authStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['User'],
      permissions: {
        rolePermissions: {
          role: {
            permission: true,
          }
        }
      },
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PerfectScrollbarModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        NgReduxModule,
        NgReduxTestingModule,
        RouterTestingModule,
      ],
      declarations: [
        InstructionsComponent,
        HeaderStubComponent,
        InfoTooltipComponent,
        RouterOutletStubComponent,
      ],
      providers: [
        {
          provide: InstructionsService,
          useValue: {
            increaseStep: () => of({}),
            getStep: () => of({}),
            getNextBtnState: () => of({}),
            getResetBtnState: () => of({}),
          }
        },
        { provide: Router, useValue: '' },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        ParsingEngineAdapterService,
        ParsingEngineService,
        { provide: ParsingEngineApiService, useValue: '' },
        ConfigService,
        AppLoggerService,
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub })
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create InstructionsComponent', () => {
    expect(component).toBeTruthy();
  });
});
