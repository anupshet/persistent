// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import * as moment from 'moment';

import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { TreePill } from '../../../../contracts/models/lab-setup';
import { QuickAccessReportComponent } from './quick-access-report.component';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../../shared/locale/locale-converter.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { forwardSlash } from '../../../../core/config/constants/general.const';

describe('QuickAccessReport', () => {
  let component: QuickAccessReportComponent;
  let fixture: ComponentFixture<QuickAccessReportComponent>;
  const storeStub = {
    selectedNode: TreePill,
    selectedLeaf: TreePill,
    currentBranch: TreePill,
    reportCreate: '',
    error: Error,
    isSideNavExpanded: false,
    showSettings: true
  };

  const selectedNode: TreePill = {
    id: 'A914E73C1F124BEF909053B1BEB2ED19',
    reportCreate: '202302',
    children: [],
    nodeType: 4,
    parentNodeId: 'EDAB53E0CA694FDF80A7CB4D756030C7',
    displayName: 'Archi300',
  };
 const data = {
    chosenReports: new Array,
    yearMonth: `202302`
  };

  const mockNavigationService = {
    setSelectedReportNotificationId: jasmine.createSpy(''),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickAccessReportComponent],
      imports: [
        RouterTestingModule
      ],
      providers: [
        DateTimeHelper,
        LocaleConverter,
        { provide: Store, useValue: storeStub },
        { provide: NavigationService, useValue: mockNavigationService },
        provideMockStore({})
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAccessReportComponent);
    component = fixture.componentInstance;
    component.navigationCurrentlySelectedNode$ = of(selectedNode);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to go to login on click', () => {
    component.selectedNode = selectedNode;
    component.selectedNode.reportCreate = data.yearMonth;
    component = fixture.componentInstance;
    const navigateSpy = spyOn(component.router, 'navigate');
    component.routeToReports();
    expect(mockNavigationService.setSelectedReportNotificationId);
    expect(navigateSpy).toHaveBeenCalledWith([unRouting.reports + forwardSlash + unRouting.reporting.newReports]);
  });

  it('selection date', () => {
    spyOn(component, 'selectionDate');
    component.ngOnInit();
    expect(component.selectionDate).toHaveBeenCalled();
  });

  it('should update the selected year, month, and data', () => {
    const datepickerSpy = jasmine.createSpyObj('MatDatepicker', ['close']);
    const normalizedSelection = moment('20237');
    component.date.setValue(moment('2022-01-01'));
    spyOn(component, 'selectionDate');
    component.chosenMonthHandler(normalizedSelection, datepickerSpy);
    expect(component.selectionDate).toHaveBeenCalled();
    expect(component.date.value.year()).toEqual(normalizedSelection.year());
    expect(component.date.value.month()).toEqual(normalizedSelection.month());
    expect(component.createReportSelectedYear).toEqual(normalizedSelection.year());
    expect(component.createReportSelectedMonth).toEqual(normalizedSelection.month() + 1);
    expect(component.data.yearMonth).toEqual('202371');
    expect(datepickerSpy.close).toHaveBeenCalled();
    expect(component.archivedData).toEqual([]);
  });

  it('should update isDisabled correctly when LabProduct selected', () => {
    component.navigationCurrentlySelectedNode$ = of(selectedNode);
    component.selectionDate();
    expect(component.isDisabled).toBe(false);
  });

  it('should update isDisabled correctly when LabInstrument selected', () => {
    component.navigationCurrentlySelectedNode$ = of(selectedNode);
    component.selectionDate();
    expect(component.isDisabled).toBe(false);
  });

});
