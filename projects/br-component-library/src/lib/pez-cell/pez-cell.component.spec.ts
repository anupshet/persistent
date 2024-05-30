import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import {
  Action,
  InteractionType,
  UserComment,
  UserInteraction,
} from '../contracts/models/data-management/page-section/analyte-user-info.model';
import { BrPezCellComponent } from './pez-cell.component';

describe('BrPezCellComponent', () => {
  let component: BrPezCellComponent;
  let fixture: ComponentFixture<BrPezCellComponent>;
  const mockMatDialog = jasmine.createSpyObj(['open', 'close', 'closeAll']);

  const testActions: Action[] = [
    {
      actionId: 6,
      actionName: 'Control repeated level 3 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
    },
    {
      actionId: 5,
      actionName: 'Control repeated level 2 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
    }
  ];

  const testComments: UserComment[] = [
    {
      content: 'kjlk',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
    },
    {
      content: 'joilkm',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
    }
  ];

  const testInteractions: UserInteraction[] = [
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    },
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [BrPezCellComponent],
      providers: [{ provide: MatDialog, useValue: mockMatDialog }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrPezCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should exist if actions/comments/reviewers exist', () => {
    component.actions = testActions;
    component.comments = testComments;
    component.interactions = testInteractions;
    fixture.detectChanges();

    const debugElementActions = fixture.debugElement.query(
      By.css('.ic-history-18dp')
    );
    const debugElementComments = fixture.debugElement.query(
      By.css('.ic-chat-bubble-outline-24px')
    );
    const debugElementReviewers = fixture.debugElement.query(
      By.css('.ic-history-18dp')
    );

    expect(debugElementActions).toBeTruthy();
    expect(debugElementComments).toBeTruthy();
    expect(debugElementReviewers).toBeTruthy();
  });

  it('should only interactions if interactions is only populated', () => {
    component.actions = null;
    component.comments = null;
    component.interactions = testInteractions;
    fixture.detectChanges();

    const debugElementActions = fixture.debugElement.query(
      By.css('ic-pez ic-change-history-24px')
    );
    const debugElementComments = fixture.debugElement.query(
      By.css('.ic-chat-bubble-outline-24px')
    );
    const debugElementReviewers = fixture.debugElement.query(
      By.css('.ic-history-18dp')
    );

    expect(debugElementActions).toBeFalsy();
    expect(debugElementComments).toBeFalsy();
    expect(debugElementReviewers).toBeTruthy();
  });

  it('should display correct number of actions/comments/reviewers', () => {
    component.actions = testActions;
    component.comments = testComments;
    component.interactions = testInteractions;
    fixture.detectChanges();

    const actionElement: DebugElement = fixture.debugElement;
    const actionNumber = actionElement.query(
      By.css('.spc_pezcell_actions_number')
    );
    const aN: HTMLElement = actionNumber.nativeElement;

    const commentElement: DebugElement = fixture.debugElement;
    const commentNumber = commentElement.query(
      By.css('.spc_pezcell_comments_number')
    );
    const cN: HTMLElement = commentNumber.nativeElement;

    const interactionElement: DebugElement = fixture.debugElement;
    const interactionNumber = interactionElement.query(
      By.css('.spc_pezcell_interactions_number')
    );
    const iN: HTMLElement = interactionNumber.nativeElement;

    expect(aN.textContent).toEqual(testActions.length.toString());
    expect(cN.textContent).toEqual(testComments.length.toString());
    expect(iN.textContent).toEqual(testInteractions.length.toString());
  });
});
