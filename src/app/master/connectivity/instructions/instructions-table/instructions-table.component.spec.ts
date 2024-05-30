import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { of, Observable } from 'rxjs';
import { InfoTooltipComponent } from 'br-component-library';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Autofixture } from 'ts-autofixture/dist/src';

import { ParsingEngineService } from '../../../../shared/services/parsing-engine.service';
import { InstructionsService } from '../instructions.service';
import { InstructionsTableComponent } from './instructions-table.component';
import { InstructionDetails } from '../../../../contracts/models/connectivity/parsing-engine/instruction-details.model';
import { InstructionIdName } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { ApiResponse } from '../../../../contracts/models/connectivity/api-response.model';
import { HeaderService } from '../../shared/header/header.service';
import { ActivatedRouteStub } from '../../../../../testing/activated-route-stub';
import { HttpLoaderFactory } from '../../../../app.module';

describe('InstructionsTableComponent', () => {
  const autofixture = new Autofixture();
  let component: InstructionsTableComponent;
  let fixture: ComponentFixture<InstructionsTableComponent>;
  const instructionsStub = autofixture.createMany(new InstructionIdName);

  const activatedRouteStub = new ActivatedRouteStub(null, { entityId: '1' });

  const apiResponse = new ApiResponse<InstructionDetails<Array<InstructionIdName>>>();
  const details = new InstructionDetails<Array<InstructionIdName>>();
  details.instruction = [];
  apiResponse.details = details;
  const mockService = {
    setFile: of(apiResponse)
  };

  const mockParsingEngineService = {
    getInstructions(labId: string): Observable<any> {
      return of(instructionsStub);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PerfectScrollbarModule],
      declarations: [
        InstructionsTableComponent,
        InfoTooltipComponent,
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
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: InstructionsService, useValue: mockService },
        { provide: ParsingEngineService, useValue: mockParsingEngineService },
        { provide: HeaderService, usevalue: {} },
        {
          provide: InstructionsService,
          useValue: {
            setFile: () => of({}),
          }
        },
        TranslateService,
        HttpClient
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
