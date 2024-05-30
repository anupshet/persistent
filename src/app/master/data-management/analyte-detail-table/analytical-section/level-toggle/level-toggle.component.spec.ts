import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Subject } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LevelToggleComponent } from './level-toggle.component';
import { LevelToggleService } from './level-toggle.service';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import {HttpLoaderFactory} from "../../../../../app.module";

const levelToggleServiceStub = {
  levelStates: new Subject<Array<boolean>>()
};

const mockErrorLoggerService = jasmine.createSpyObj([
  'logErrorToBackend',
  'populateErrorObject'
]);

describe('LevelToggleComponent', () => {
  let component: LevelToggleComponent;
  let fixture: ComponentFixture<LevelToggleComponent>;
  let compiled;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          MatButtonToggleModule,
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
        declarations: [LevelToggleComponent],
        providers: [
          {
            provide: LevelToggleService,
            useValue: levelToggleServiceStub
          }, {
            provide: ErrorLoggerService,
            useValue: mockErrorLoggerService
          },
          TranslateService,
        ]
      }).compileComponents();

    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelToggleComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate 3 toggle buttons', () => {
    expect(compiled.querySelector('.level1')).toBeDefined();
    expect(compiled.querySelector('.level2')).toBeDefined();
    expect(compiled.querySelector('.level3')).toBeDefined();
    expect(compiled.querySelector('.level4')).toBeNull();
  });
});
