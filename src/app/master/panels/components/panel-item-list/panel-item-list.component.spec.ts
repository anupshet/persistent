// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PanelItemListComponent } from './panel-item-list.component';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';



describe('PanelItemListComponent', () => {
  let component: PanelItemListComponent;
  let fixture: ComponentFixture<PanelItemListComponent>;


  const mockItemList = [{
    'displayName': 'Folate',
    'testSpecId': '722',
    'correlatedTestSpecId': 'AC9D5C5681C54833B65F68E79009BFD5',
    'testId': '721',
    'labUnitId': '2',
    'testSpecInfo': null,
    'levelSettings': {
      'levelEntityId': null,
      'levelEntityName': 'LevelSetting',
      'parentLevelEntityId': '884e0f4b-4c02-49a2-9a36-3a4aca51f77d',
      'parentLevelEntityName': 'LabTest',
      'minNumberOfPoints': 0,
      'runLength': 0,
      'dataType': 1,
      'targets': null,
      'rules': null,
      'levels': [{
        'levelInUse': true,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }],
      'id': 'eabb5bec-1334-6e0a-0358-1255e9c803a1',
      'parentNodeId': '884e0f4b-4c02-49a2-9a36-3a4aca51f77d',
      'parentNode': null,
      'nodeType': 8,
      'displayName': 'eabb5bec-1334-6e0a-0358-1255e9c803a1',
      'children': null,
      'isUnavailable': false,
      'unavailableReasonCode': null
    },
    'accountSettings': null,
    'hasOwnAccountSettings': false,
    'mappedTestSpecs': null,
    'isArchived': true,
    'id': '884e0f4b-4c02-49a2-9a36-3a4aca51f77d',
    'parentNodeId': '4cf4b318-3eae-40eb-94d6-a0d36fb16212',
    'parentNode': null,
    'nodeType': 6,
    'children': [],
    'isUnavailable': false,
    'unavailableReasonCode': ''
  }, {
    'displayName': 'Ferritin',
    'testSpecId': '16',
    'correlatedTestSpecId': '24796EE042DA4F71A77BC0B9DE46CA05',
    'testId': '16',
    'labUnitId': '2',
    'testSpecInfo': null,
    'levelSettings': {
      'levelEntityId': null,
      'levelEntityName': 'LevelSetting',
      'parentLevelEntityId': 'afde98ba-4a58-4094-86bf-61ec107b991f',
      'parentLevelEntityName': 'LabTest',
      'minNumberOfPoints': 0,
      'runLength': 0,
      'dataType': 1,
      'targets': null,
      'rules': null,
      'levels': [{
        'levelInUse': true,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }, {
        'levelInUse': false,
        'decimalPlace': 2
      }],
      'id': '76bb68d9-9a34-884c-6b9d-b50240679c40',
      'parentNodeId': 'afde98ba-4a58-4094-86bf-61ec107b991f',
      'parentNode': null,
      'nodeType': 8,
      'displayName': '76bb68d9-9a34-884c-6b9d-b50240679c40',
      'children': null,
      'isUnavailable': false,
      'unavailableReasonCode': null
    },
    'accountSettings': null,
    'hasOwnAccountSettings': false,
    'mappedTestSpecs': null,
    'isArchived': true,
    'id': 'afde98ba-4a58-4094-86bf-61ec107b991f',
    'parentNodeId': '4cf4b318-3eae-40eb-94d6-a0d36fb16212',
    'parentNode': null,
    'nodeType': 6,
    'children': [],
    'isUnavailable': false,
    'unavailableReasonCode': 'null'
  }];

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
      declarations: [
        PanelItemListComponent
      ],
      providers: [
        TranslateService,
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        HttpClient,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove the item from list', () => {
    component.selectedItems = mockItemList;
    fixture.detectChanges();
    spyOn(component, 'removeItem').and.callThrough();
    const spyObj = spyOn(component.sortedItemsEvent, 'emit').and.callThrough();
    component.removeItem(mockItemList[0]);
    expect(spyObj).toHaveBeenCalled();
  });

  it('should remove the item from archived list', () => {
    component.selectedItems = mockItemList;
    component.archivedItemList = mockItemList;
    fixture.detectChanges();
    const spy = spyOn(component, 'removeArchiveItem').and.callThrough();
    fixture.detectChanges();
    const spyObj = spyOn(component.sortedItemsEvent, 'emit').and.callThrough();
    const closeButtonElement = fixture.debugElement.query(By.css('.spec_close_archived_btn')).nativeElement;
    closeButtonElement.click();
    expect(spy).toHaveBeenCalled();
    expect(spyObj).toHaveBeenCalled();
  });
});
