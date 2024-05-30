// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MasterLotDialogComponent } from './master-lot-dialog.component';
import { HttpLoaderFactory } from '../../../../../app.module';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import { Permissions } from '../../../../../security/model/permissions.model';

describe('MasterLotDialogComponent', () => {
  let component: MasterLotDialogComponent;
  let fixture: ComponentFixture<MasterLotDialogComponent>;

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.NonBRLotManagement];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterLotDialogComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }, TranslateService,
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
      ],
      imports: [
        MatDialogModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterLotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
