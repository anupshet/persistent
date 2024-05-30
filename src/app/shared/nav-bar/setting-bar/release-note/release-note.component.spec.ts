// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReleaseNoteComponent } from './release-note.component';
import { ReleaseNotesService } from '../release-note.service';
import { ConfigService } from '../../../../core/config/config.service';
import { SpinnerService } from '../../../services/spinner.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('ReleaseNoteComponent', () => {
  let component: ReleaseNoteComponent;
  let fixture: ComponentFixture<ReleaseNoteComponent>;
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReleaseNoteComponent],
      imports: [
        NgxExtendedPdfViewerModule,
        PerfectScrollbarModule,
        MatDialogModule,
        HttpClientTestingModule,
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
        ReleaseNotesService,
        SpinnerService,
        {
          provide: ConfigService,
          useValue: { getConfig: () => of({}) }
        },
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub }),
        TranslateService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
