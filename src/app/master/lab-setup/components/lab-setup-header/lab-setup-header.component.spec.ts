// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { MaterialModule } from 'br-component-library';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { LabSetupHeaderComponent } from './lab-setup-header.component';
import { HttpLoaderFactory } from '../../../../app.module';
import { NavigationService } from '../../../../shared/navigation/navigation.service';


describe('LabSetupHeaderComponent', () => {
  let component: LabSetupHeaderComponent;
  let fixture: ComponentFixture<LabSetupHeaderComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const dialogRefStub = {
    close: () => { },
    afterClosed: () => of(false)
  };

  const mockMatDialog = {
    open: () => dialogRefStub,
    close: () => { }
  };

  const mockNavigationService = {
    goPreviousPageInLabSetup: jasmine.createSpy()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        HttpClientModule,
        MatIconModule,
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
      declarations: [LabSetupHeaderComponent],
      providers: [
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: NavigationService, useValue: mockNavigationService },
        AppLoggerService,
        TranslateService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSetupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display header on current node data', () => {
    component.currentNode = 0;
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('.type-account')).toBeTruthy();
  });

  it('should display title text', () => {
    component.currentNode = 0;
    component.title = 'blah';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.title).toBe('blah');
    });
  });
});
