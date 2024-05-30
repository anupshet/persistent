// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from 'br-component-library';
import { AuthenticationService } from '../../../security/services';
import { LabLocationService } from '../../lab-location.service';
import { NavigationService } from '../../navigation/navigation.service';
import { TreeNodesService } from '../../services/tree-nodes.service';
import { TreeNodesAction } from '../../state/tree-nodes.action';
import { UserBarComponent } from './user-bar.component';
import { HttpLoaderFactory } from '../../../app.module';


describe('UserBarComponent', () => {
  let component: UserBarComponent;
  let fixture: ComponentFixture<UserBarComponent>;
  const appState = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgReduxTestingModule,
        RouterTestingModule,
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
      declarations: [UserBarComponent],
      providers: [
        {
          provide: TreeNodesService,
          useValue: { getTreeNodes: () => { } }
        },
        {
          provide: TreeNodesAction,
          useValue: { getRootNode: () => { } }
        },
        {
          provide: LabLocationService,
          useValue: { getLabLocationsByLab: () => { of(); } }
        },
        {
          provide: NavigationService,
          useValue: { navigateToLogin: () => { } }
        },
        {
          provide: AuthenticationService,
          useValue: {
            logOut: () => { of(); }
          }
        },
        TranslateService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
