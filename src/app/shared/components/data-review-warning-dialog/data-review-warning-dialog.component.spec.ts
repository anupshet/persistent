// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataReviewWarningDialogComponent } from './data-review-warning-dialog.component';

describe('DataReviewWarningDialogComponent', () => {
  let component: DataReviewWarningDialogComponent;
  let fixture: ComponentFixture<DataReviewWarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataReviewWarningDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => { } } },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataReviewWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancel with onCancel', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.onCancel();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close the dialog with emitting false on click of OK button', inject([MatDialogRef], matDialogRef => {
    const spy = spyOn(matDialogRef, 'close');
    const okButtonElement = fixture.debugElement.nativeElement.querySelector('.spec_ok');
    okButtonElement.click();
    expect(spy).toHaveBeenCalledWith(false);
  })
  );

  it('should cancel with closeDialog', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });
});
