// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LanguageDropdownComponent } from './language-dropdown.component';
import { FeatureFlagsService } from '../../services/feature-flags.service';
import { HttpLoaderFactory } from '../../../app.module';

describe('LanguageDropdownComponent', () => {
  let component: LanguageDropdownComponent;
  let fixture: ComponentFixture<LanguageDropdownComponent>;

  const mockFeatureFlagsService = {
    hasClientInitialized: () => true,
    getFeatureFlag: () => true,
    getClient: () => { return { on: () => {} } }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageDropdownComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        { provide: FeatureFlagsService, useValue: mockFeatureFlagsService },
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: LanguageDropdownComponent,
          multi: true
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageDropdownComponent);
    component = fixture.componentInstance;
    component.control = new FormControl();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show required error', () => {
    component.errors = ['required'];
    component.control.setValue({ touched: true });
    component.control.setErrors({ require: true });
    const showRequiredMessageError = component.showErrorByType('required');
    expect(showRequiredMessageError).toBeTruthy();
  });
});
