import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { CardComponent } from './card.component';
import { SharedModule } from '../shared.module';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let iconRegistry;
  let sanitizer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        MatIconModule,
        SharedModule,
        StoreModule.forRoot({})
      ],
      providers: [
        { provide: Router, useValue: '' }
      ],
      declarations: [CardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    iconRegistry = TestBed.get(MatIconRegistry);
    sanitizer = TestBed.get(DomSanitizer);
    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/images/matIcons/ic_add_circle_outline_24px.svg'));

    component = fixture.componentInstance;
    component.actionLink = {
      text: 'Add an Instrument',
      url: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    component.actionLink.text = 'Add an Instrument';
    component.actionLink.url = '';
    expect(component).toBeTruthy();
  });

  it('should display card title', () => {
    component.title = 'chemistry';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.title).toBe('chemistry');
    });
  });

  it('should display count', () => {
    component.count = 3;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.count).toBe(3);
    });
  });

  it('should display icon and link route', () => {
    component.actionLink.text = 'Add an Instrument';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.actionLink.text).toBe('Add an Instrument');
    });
  });


});
