// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ReportsGenericDialogComponent } from './reports-generic-dialog.component';
import { DynamicReportingService } from '../../../../../shared/services/reporting.service';

describe('ReportsGenericDialogComponent', () => {
  let component: ReportsGenericDialogComponent;
  let fixture: ComponentFixture<ReportsGenericDialogComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  const mockTestSpecDynamicReportingService = {
    saveTemplate: () => of([]).toPromise(),
    updateTemplate: () => of([]).toPromise()
  };

  const dialogRefStub = {
    close: () => { },
    afterClosed: () => of(false)
  };

  const dialogStub = {
    open: () => dialogRefStub,
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsGenericDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: dialogStub },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: DynamicReportingService, useValue: mockTestSpecDynamicReportingService },
      ],
      imports: [
        MatDialogModule
      ]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsGenericDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
