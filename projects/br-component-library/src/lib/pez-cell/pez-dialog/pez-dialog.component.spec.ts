import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { BrPezDialogComponent } from './pez-dialog.component';
import { BrCore } from '../../shared';

describe('PezDialogComponent', () => {
  let component: BrPezDialogComponent;
  let fixture: ComponentFixture<BrPezDialogComponent>;

  @Component({
    selector: 'br-perfect-scrollbar',
    template: '<div></div>'
  })
  class FakePerfectScrollbarComponent {
    @Input() config: PerfectScrollbarConfigInterface;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        BrCore
      ],
      declarations: [
        BrPezDialogComponent,
        FakePerfectScrollbarComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrPezDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
