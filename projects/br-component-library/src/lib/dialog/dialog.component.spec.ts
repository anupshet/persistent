import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DialogResult } from '../contracts/enums/dialog-result';
import { BrDialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: BrDialogComponent;
  let fixture: ComponentFixture<BrDialogComponent>;
  let debugElement: DebugElement;
  const data = {
    title: 'Dialog Title',
    cancelButtonLabel: 'Cancel',
    confirmButtonLabel: 'Confirm'
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrDialogComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonToggleModule
      ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrDialogComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    component.title = data.title;
    component.cancelButtonLabel = data.cancelButtonLabel;
    component.confirmButtonLabel = data.confirmButtonLabel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data text values in Dialog', () => {
    const title = debugElement.query(By.css('h2')).nativeElement.textContent;
    const cancelButtonLabel = debugElement.query(By.css('#dialog_button1')).nativeElement.textContent;
    const confirmButtonLabel = debugElement.query(By.css('#dialog_button2')).nativeElement.textContent;

    expect(title).toBe(data.title);
    expect(cancelButtonLabel).toBe(data.cancelButtonLabel);
    expect(confirmButtonLabel).toBe(data.confirmButtonLabel);
  });

  it('should call onClick function on button click', async(() => {
    spyOn(component, 'onClick');

    const button1 = debugElement.query(By.css('#dialog_button1'));
    const button2 = debugElement.query(By.css('#dialog_button2'));
    button1.triggerEventHandler('click', null);
    button2.triggerEventHandler('click', null);

    fixture.detectChanges();
    expect(component.onClick).toHaveBeenCalled();
  }));

  it('should emit DialogResult value on ButtonClicked event', async(() => {
    // Spy on event emitter
    spyOn(component.buttonClicked, 'emit');

    component.dialogResult = DialogResult;
    const result = component.dialogResult;

    // Trigger click event
    const button = debugElement.query(By.css('button')).nativeElement;
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    component.onClick(result.None);
    component.onClick(result.OK);
    component.onClick(result.Cancel);

    expect(component.buttonClicked.emit).toHaveBeenCalledWith(result.None);
    expect(component.buttonClicked.emit).toHaveBeenCalledWith(result.OK);
    expect(component.buttonClicked.emit).toHaveBeenCalledWith(result.Cancel);
  }));
});
