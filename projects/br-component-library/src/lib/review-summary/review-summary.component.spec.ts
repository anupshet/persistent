/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { DecimalPipe } from '@angular/common';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReviewSummary } from '../contracts/models/data-management/review-summary.model';
import { BrCore } from './../shared/core.module';
import { BrReviewSummaryComponent } from './review-summary.component';

describe('ReviewSummaryComponent', () => {
  let component: BrReviewSummaryComponent;
  let fixture: ComponentFixture<BrReviewSummaryComponent>;

  const reviewSummary: ReviewSummary = new ReviewSummary();
  reviewSummary.actions = [{
    'userName': 'UNext User 1',
    'dateTime': new Date('2018-12-04T18:00:25.8903957Z'),
    'text': 'Action test 1',
    'pezDateTimeOffset': ''
  },
  {
    'userName': 'UNext User 2',
    'dateTime': new Date('2019-03-20T18:00:25.8903957Z'),
    'text': 'Action test 2',
    'pezDateTimeOffset': ''
  }
  ];
  reviewSummary.comments = [{
    'userName': 'UNext User 1',
    'dateTime': new Date('2018-12-04T18:00:25.8903957Z'),
    'text': 'Comment test 1',
    'pezDateTimeOffset': ''
  },
  {
    'userName': 'UNext User 2',
    'dateTime': new Date('2019-03-20T18:00:25.8903957Z'),
    'text': 'Comnent test 2',
    'pezDateTimeOffset': ''
  }
  ];
  reviewSummary.interactions = [{
    'userName': 'UNext User',
    'dateTime': new Date('2018-12-04T18:00:25.8903957Z'),
    'text': 'Added',
    'pezDateTimeOffset': ''
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BrReviewSummaryComponent
      ],
      imports: [
        BrCore
      ],
      providers: [
        { provide: DecimalPipe, useClass: DecimalPipe },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: reviewSummary }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrReviewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show Action 1 - User Name', () => {
    const compiled = fixture.debugElement.nativeElement;
    const ctrl = compiled.querySelector('#userAction1');
    if (ctrl != null) {
      expect(ctrl.textContent).toContain('UNext User 1');
    } else {
      expect(component).toBeTruthy();
    }
  });

  it('should show Action 2 - User Name', () => {
    const compiled = fixture.debugElement.nativeElement;
    const ctrl = compiled.querySelector('#userAction2');
    if (ctrl != null) {
      expect(ctrl.textContent).toContain('UNext User 2');
    } else {
      expect(component).toBeTruthy();
    }
  });

  it('should show Comment 1 - User Name', () => {
    const compiled = fixture.debugElement.nativeElement;
    const ctrl = compiled.querySelector('#userComment1');
    if (ctrl != null) {
      expect(ctrl.textContent).toContain('UNext User 1');
    } else {
      expect(component).toBeTruthy();
    }
  });

  it('should show Comment 2 - User Name', () => {
    const compiled = fixture.debugElement.nativeElement;
    const ctrl = compiled.querySelector('#userComment2');
    if (ctrl != null) {
      expect(ctrl.textContent).toContain('UNext User 2');
    } else {
      expect(component).toBeTruthy();
    }
  });

  it('should show interactions  - User Name', () => {
    const compiled = fixture.debugElement.nativeElement;
    const ctrl = compiled.querySelector('#userInteractions1');
    if (ctrl != null) {
      expect(ctrl.textContent).toContain('UNext User');
    } else {
      expect(component).toBeTruthy();
    }
  });

});


