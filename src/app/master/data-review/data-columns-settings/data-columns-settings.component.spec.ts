// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { MaterialModule } from 'br-component-library';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import * as mockData from '../../../../../db.json';
import { DataReviewService } from '../../../shared/api/data-review.service';
import { DataColumnsSettingsComponent } from './data-columns-settings.component';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { HttpLoaderFactory } from '../../../app.module';

describe('DataColumnsSettingsComponent', () => {
  let component: DataColumnsSettingsComponent;
  let fixture: ComponentFixture<DataColumnsSettingsComponent>;
  const saveUserReviewPreferences = mockData.userPreferences;
  const mockDataReviewService = {
    getDataReviewData: () => {
      return of(saveUserReviewPreferences);
    },
    reviewData: () => {
      return of();
    }
  };
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockMessageSnackBarService = {
    showMessageSnackBar: () => {
      return {};
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataColumnsSettingsComponent ],
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MaterialModule,
        HttpClientModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        { provide: DataReviewService, useValue: mockDataReviewService },
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MessageSnackBarService, useValue: mockMessageSnackBarService },
        TranslateService,
      ]
    })
    .compileComponents();
  }));

  const mockTranslationService = {
    getDataColumnTranslation: () => { },
     getTranslatedMessage: () => {
      return 'Date';
     }
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(DataColumnsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create for close button', () => {
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#closeBtn')).toBeNull();
  });

  it('should create for Update button', () => {
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#updateBtn')).toBeNull();
  });

  it('should calls Close Menu on close function ', () => {
    const menuTigger: MatMenuTrigger = fixture.debugElement.query(By.directive(MatMenuTrigger)).injector.get(MatMenuTrigger);
    spyOn(menuTigger, 'closeMenu');
    component.close();
    expect(menuTigger.closeMenu).toHaveBeenCalledTimes(1);
  });

  it('should reset with cancel function', () => {
    fixture.detectChanges();
    spyOn(component, 'close').and.callThrough();
    component.close();
    expect(component.close).toHaveBeenCalled();
  });

});
