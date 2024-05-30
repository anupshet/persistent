// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GreetingComponent } from './greeting.component';
import { UnextTimePeriodPipe } from '../../../../shared/date-time/pipes/unext-time-period.pipe';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('GreetingComponent', () => {
  let component: GreetingComponent;
  let fixture: ComponentFixture<GreetingComponent>;
  const currentDateTime = new Date();
  const objTimeZones = {
    LosAngeles: 'America/Los_Angeles',
    Chatham: 'Pacific/Chatham'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GreetingComponent,
        UnextTimePeriodPipe
      ],
      imports: [
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
      providers: [AppLoggerService, TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.firstName = 'TestName';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return "Good morning" for America/Los_Angeles timezone', () => {
    const compiled = fixture.debugElement.nativeElement;
    currentDateTime.setUTCHours(13, 0, 0); // at 1pm UTC there is 6am in LA
    component.currentDateTime = currentDateTime;
    component.timeZone = objTimeZones.LosAngeles;
    fixture.detectChanges();
    expect(compiled.querySelector('#greetingTextGood')
    .textContent + '' + compiled.querySelector('#greetingTextDayPeriod').textContent + ', ' + compiled
    .querySelector('#greetingTextFirstName').textContent).toContain('GREETING.GOOD GREETING.MORNING' + ', ' + component.firstName);
  });

  it('should return "Good afternoon" America/Los_Angeles timezone', () => {
    const compiled = fixture.debugElement.nativeElement;
    currentDateTime.setUTCHours(20, 0, 0); // at 8pm UTC there is 1pm in LA
    component.currentDateTime = currentDateTime;
    component.timeZone = objTimeZones.LosAngeles;
    fixture.detectChanges();
    expect(compiled.querySelector('#greetingTextGood').textContent + '' + compiled
    .querySelector('#greetingTextDayPeriod').textContent + ', ' + compiled
    .querySelector('#greetingTextFirstName').textContent).toContain('GREETING.AFTERNOON, ' + component.firstName);
  });

  it('should return "Good evening" America/Los_Angeles timezone', () => {
    const compiled = fixture.debugElement.nativeElement;
    currentDateTime.setUTCHours(1, 0, 0); // at 1am UTC there is 6pm in LA
    component.currentDateTime = currentDateTime;
    component.timeZone = objTimeZones.LosAngeles;
    fixture.detectChanges();
    expect(compiled.querySelector('#greetingTextGood').textContent + '' + compiled
    .querySelector('#greetingTextDayPeriod').textContent + ', ' + compiled
    .querySelector('#greetingTextFirstName').textContent).toContain('GREETING.EVENING, ' + component.firstName);
  });

  it('should return "Good morning" for Pacific/Chatham', () => {
    const compiled = fixture.debugElement.nativeElement;
    currentDateTime.setUTCHours(18, 0, 0); // at 6pm UTC there is 6:45am in Chatham
    component.currentDateTime = currentDateTime;
    component.timeZone = objTimeZones.Chatham;
    fixture.detectChanges();
    expect(compiled.querySelector('#greetingTextGood').textContent + '' + compiled
    .querySelector('#greetingTextDayPeriod').textContent + ', ' + compiled.querySelector('#greetingTextFirstName')
    .textContent).toContain('GREETING.GOOD GREETING.MORNING' + ', ' + component.firstName);
  });

  it('should return "Good afternoon" for Pacific/Chatham', () => {
    const compiled = fixture.debugElement.nativeElement;
    currentDateTime.setUTCHours(1, 0, 0); // at 1am UTC there is 1:45pm in Chatham
    component.currentDateTime = currentDateTime;
    component.timeZone = objTimeZones.Chatham;
    fixture.detectChanges();
    expect(compiled.querySelector('#greetingTextGood').textContent + '' + compiled
    .querySelector('#greetingTextDayPeriod').textContent + ', ' + compiled.querySelector('#greetingTextFirstName')
    .textContent).toContain('GREETING.AFTERNOON, ' + component.firstName);
  });

  it('should return "Good Evening" for Pacific/Chatham', () => {
    const compiled = fixture.debugElement.nativeElement;
    currentDateTime.setUTCHours(7, 0, 0); // at 7am UTC there is 7:45pm in Chatham
    component.currentDateTime = currentDateTime;
    component.timeZone = objTimeZones.Chatham;
    fixture.detectChanges();
    expect(compiled.querySelector('#greetingTextGood').textContent + '' + compiled
    .querySelector('#greetingTextDayPeriod').textContent + ', ' + compiled.querySelector('#greetingTextFirstName')
    .textContent).toContain('GREETING.EVENING, ' + component.firstName);
  });

});
