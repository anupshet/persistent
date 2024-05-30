// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { QcReviewResultComponent } from './qc-review-result.component';
import { NavigationService } from '../../../../shared/navigation/navigation.service';

describe('QcReviewResultComponent', () => {
  let component: QcReviewResultComponent;
  let fixture: ComponentFixture<QcReviewResultComponent>;
  const mockNavigationService = {
    navigateToDataReview: () => { },
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [ QcReviewResultComponent ],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcReviewResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard review', () => {
    fixture = TestBed.createComponent(QcReviewResultComponent);
    fixture.detectChanges();
    const spy = spyOn(mockNavigationService, 'navigateToDataReview');
    component.openDataReviewComponent();
    expect(spy).toHaveBeenCalled();
  });
});
