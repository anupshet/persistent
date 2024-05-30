import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { BrChangeLotComponent } from './change-lot.component';
import { BrSelectComponent } from '../select/select.component';
import { ChangeLotModel } from '../contracts/models/data-management/data-entry/change-lot.model';

@Component({
  template: `
    <form [formGroup]="form" novalidate>
      <br-change-lot
        [changeLotModel]="testChangeLotModel"
        [isFormVisible]="isFormVisible" [isPointEntry]="isPointEntry" [showOptions]="showOptions"
        [translationLabelDictionary]="testTranslationLabelDictionary"
      >
      </br-change-lot>
    </form>`
})

class TestHostComponent implements OnInit {
  @ViewChild(BrChangeLotComponent, { static: false }) child: BrChangeLotComponent;
  changeLotModel: ChangeLotModel;
  translationLabelDictionary: {};
  form: FormGroup;
  changeLotFormControl: FormControl;
  commentLinkVisibility = true;
  isFormVisible = false;
  isPointEntry = false;
  showOptions = false;

  testChangeLotModel: ChangeLotModel = {
    labTestId: '1',
    reagentLots: [
      { id: 1, reagentId: 1, lotNumber: '1',  reagentCategory: 1, shelfExpirationDate: new Date() },
      { id: 3, reagentId: 3, lotNumber: '3',  reagentCategory: 1, shelfExpirationDate: new Date() }
    ],
    calibratorLots: [
      {
        id: 2,
        calibratorId: 2,
        lotNumber: '2',
        shelfExpirationDate: new Date()
      },
      {
        id: 4,
        calibratorId: 4,
        lotNumber: '4',
        shelfExpirationDate: new Date()
      }
    ],
    errorMessages: [],
    defaultReagentLot: {
      id: 1,
      reagentId: 1,
      lotNumber: '1',
      reagentCategory: 1,
      shelfExpirationDate: new Date()
    },
    defaultCalibratorLot: {
      id: 2,
      calibratorId: 2,
      lotNumber: '2',
      shelfExpirationDate: new Date()
    },
    selectedReagentLot: {
      id: 1,
      reagentId: 1,
      lotNumber: '1',
      reagentCategory: 1,
      shelfExpirationDate: new Date()
    },
    selectedCalibratorLot: {
      id: 2,
      calibratorId: 2,
      lotNumber: '2',
      shelfExpirationDate: new Date()
    },
    comment: '',
    action: {
      actionId: 123,
      actionName: 'test',
      userId: '1234',
      userFullName: 'test user',
      enterDateTime: new Date()
    }
  };

  testTranslationLabelDictionary = {
    addAComment: ' Add a comment ',
    calibratorLot: ' Calibrator Lot ',
    enterAllValues: ' Enter all values ',
    enterMean: ' Enter Mean ',
    enterSD: ' Enter SD ',
    errorLotExpired: ' Expired ',
    lotHasExpired: ' Lot has expired ',
    reagentLot: ' Reagent Lot ',
    sdShouldBeZero: ' SD should be zero '
  };

  createForm() {
    this.changeLotFormControl = new FormControl(this.testChangeLotModel);
    this.translationLabelDictionary = this.testTranslationLabelDictionary;
    this.form = new FormGroup({
      changeLot: this.changeLotFormControl
    });
  }

  constructor() { }

  ngOnInit() {
    this.createForm();
  }

  resetComponent() {
    this.changeLotFormControl = new FormControl(null);
    this.form = new FormGroup({
      changeLot: this.changeLotFormControl
    });
  }

  triggerOnReagentChanged() {
    const testLot = {
      id: 3,
      reagentId: 3,
      lotNumber: '3',
      reagentCategory: 1,
      shelfExpirationDate: new Date()
    };
    this.child.onReagentChanged(testLot);
  }

  returnFormChangeLotModel() {
    return this.changeLotFormControl.value;
  }
}

describe('ChangeLotComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [BrChangeLotComponent, BrSelectComponent, TestHostComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.resetComponent();
    fixture.detectChanges();
    component.createForm();
    fixture.detectChanges();
  });

  function testElementDoesExist(classText: string) {
    const targetElement = fixture.nativeElement.querySelector('.' + classText);
    expect(targetElement).toBeTruthy();
  }

  function testElementDoesNotExist(classText: string) {
    const targetElement = fixture.nativeElement.querySelector('.' + classText);
    expect(targetElement).toBeFalsy();
  }

  xit('should create', () => {
    expect(component).toBeTruthy();
    testElementDoesNotExist('lot-dropdown');
    testElementDoesNotExist('comment');
  });

  // Clicking add Comment reveals add Comment form (no lot select dropdowns)
  it('should reveal Comment form after add comment link clicked', () => {
    const link = fixture.nativeElement.querySelector('.add-comment-link');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      link.click();
      testElementDoesExist('comment');
      testElementDoesNotExist('lot-dropdown');
    });
  });

  // Clicking Change Lot reveals dropdowns (no add comment dropdown)
  it('should reveal form after open lot select link clicked', () => {
    const link = fixture.nativeElement.querySelector('.open-lot-select');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      link.click();
      testElementDoesExist('lot-dropdown');
      testElementDoesNotExist('comment');
    });
  });

  // Verify that doing formGet will return selected value
  it('should return selected lot', () => {
    fixture.detectChanges();
    component.triggerOnReagentChanged(); // Bypass the usage of Br-Select since we're not testing that component
    expect(
      component.returnFormChangeLotModel().selectedReagentLot.lotNumber
    ).toBe('3');
  });

  // hide add comment link
  it('should hide comment link if needbe', () => {
    component.commentLinkVisibility = false;
    fixture.detectChanges();
    testElementDoesNotExist('add-comment-link');
  });

  xit('should emit event on click of dont see reagent lot', () => {
    const dontSeeReagentLotElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_dontSeeReagentLot');
    const spy = spyOn(component.child, 'requestNewConfiguration');
    const spy1 = spyOn(component.child.requestNewConfig, 'emit');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      dontSeeReagentLotElement.click();
      expect(spy).toHaveBeenCalledWith(component.child.newRequestConfigType.ReagentLot);
      expect(spy1).toHaveBeenCalledWith(component.child.newRequestConfigType.ReagentLot);
    });
  });

  it('should display corrective actions drop down when point data entry', () => {
    component.child.isFormVisible = true;
    testElementDoesNotExist('spec-corrective-actions'); // before isPointEntry = true
    component.child.isPointEntry = true;
    component.child.createForm();
    component.showOptions = true;
    component.isFormVisible = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      testElementDoesExist('spec-corrective-actions'); // after isPointEntry = true
    });
  });

  it('should call change method on change of selection of corrective actions dropdown', () => {
    const spy = spyOn(component.child, 'onActionChanged');
    component.child.isFormVisible = true;
    component.child.isPointEntry = true;
    component.child.correctiveActions = [component.testChangeLotModel.action];
    component.child.createForm();
    component.showOptions = true;
    component.isFormVisible = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const correctiveActions = fixture.nativeElement.querySelector('.spec-corrective-actions');
      correctiveActions.click();
      fixture.detectChanges();
      const options = fixture.nativeElement.querySelectorAll('.spec-corrective-acitons-options');
      options[0].click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
});
