// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { NavCurrentLocationComponent } from './nav-current-location.component';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../services/errorLogger/error-logger.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavCurrentLocationComponent', () => {
  let component: NavCurrentLocationComponent;
  let fixture: ComponentFixture<NavCurrentLocationComponent>;
  const initialState = {};


    class MockRouter {
    readonly url = '/data/dfbe213d-0935-4ede-ac8c-86f79e6fa146/6/table';
    public ne = new NavigationEnd(0, 'http://localhost:4200', 'http://localhost:4200');
    public events = new Observable(observer => {
      observer.next(this.ne);
      observer.complete();
    });
  }
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        HttpClientModule,
        MatTooltipModule,
        RouterTestingModule,TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [NavCurrentLocationComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useClass: MockRouter},
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        TranslateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavCurrentLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if tool tip labels gets changed', () => {
    spyOn(component, 'toolTipLabels');
    component.nodeType = EntityType.LabLocation;
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.toolTipLabels).toHaveBeenCalled();
  });

  it('should check if tool tip labels populate for settings', () => {
    component['nodeType'] = EntityType.LabLocation;
    component.toolTipLabels();
    fixture.detectChanges();
    expect(component.displayText).toEqual('TRANSLATION.GOSETTINGS');
  });
  it('should check if tool tip labels populate for departments', () => {
    component['nodeType'] = EntityType.LabDepartment;
    component.toolTipLabels();
    fixture.detectChanges();
    expect(component.displayText).toEqual('TRANSLATION.GODEPARTMENTS');
  });
  it('should check if tool tip labels populate for instruments', () => {
    component['nodeType'] = EntityType.LabInstrument;
    component.toolTipLabels();
    fixture.detectChanges();
    expect(component.displayText).toEqual('TRANSLATION.INSTRUMENTS');
  });
  it('should check if tool tip labels populate for controls', () => {
    component['nodeType'] = EntityType.LabProduct;
    component.toolTipLabels();
    fixture.detectChanges();
    expect(component.displayText).toEqual('TRANSLATION.LISTCONTROLS');
  });
  it('should check if tool tip labels analytes', () => {
    component['nodeType'] = EntityType.LabTest;
    component.toolTipLabels();
    fixture.detectChanges();
    expect(component.displayText).toEqual('TRANSLATION.LISTANALYTES');
  });

  it('should check navigate to parrent with click of back arrow', () => {
    const spyObj = spyOn(component.navigateToParent, 'emit').and.callThrough();
    component['nodeType'] = EntityType.LabProduct;
    fixture.detectChanges();
    const event = new Event('click');
    const backArrow = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_back_arrow');
    backArrow.dispatchEvent(event);
    fixture.whenStable().then(() => {
      expect(spyObj).toHaveBeenCalled();
    });
  });

  it('should check navigate to settings when click on header title', () => {
    spyOn(component.navigateToSettings, 'emit');
    component['nodeType'] = EntityType.LabLocation;
    fixture.detectChanges();
    const title = fixture.debugElement.nativeElement.querySelector('.spec_title');
    title.click();
    fixture.detectChanges();
    expect(component.navigateToSettings.emit).toHaveBeenCalled();
  });
});
