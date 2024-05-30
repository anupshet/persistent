// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { PezType } from '../../lib/contracts/enums/pez-type.enum';
import {
  Action,
  UserComment,
  UserInteraction,
} from '../../lib/contracts/models/data-management/page-section/analyte-user-info.model';
import { Pez, PezContent } from '../../lib/contracts/models/data-management/pez.model';
import { BrPezDialogComponent } from './pez-dialog/pez-dialog.component';

@Component({
  selector: 'br-pez-cell',
  templateUrl: './pez-cell.component.html',
  styleUrls: ['./pez-cell.component.scss']
})
export class BrPezCellComponent implements OnInit {
  private pezDialogRef: MatDialogRef<BrPezDialogComponent>;
  pezData: Pez;
  hoverOnRight: boolean;
  isAction: boolean;
  isComment: boolean;
  isUserInteraction: boolean;
  isPezDialogOpen = false;
  isPointerOnDialog = false;
  timer: any;
  @Input() actionTitle: string;
  @Input() commentTitle: string;
  @Input() actionLogsTitle: string;
  @Input()
  actions: Action[];
  @Input()
  comments: UserComment[];
  @Input()
  interactions: UserInteraction[];
  @Input() pezDateTimeOffset: string;
  @Input() allowInteractionsHover: boolean;
  @Input() atText: string;

  @Output() showReviewSummaryDialog: EventEmitter<any> = new EventEmitter();
  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  generatePezContent(type: number): Pez {
    const pez: Pez = {
      contents: new Array<PezContent>(),
      pezType: null
    };

    switch (type) {
      case 1:
        pez.pezType = PezType.Action;
        this.actions.forEach(action => {
          const pezContent: PezContent = {
            userName: action.userFullName,
            text: action.actionName,
            dateTime: action.enterDateTime,
            pezDateTimeOffset: this.pezDateTimeOffset
          };

          pez.contents.push(pezContent);
        });
        break;
      case 2:
        pez.pezType = PezType.Comment;
        this.comments.forEach(comment => {
          const pezContent: PezContent = {
            userName: comment.userFullName,
            text: comment.content,
            dateTime: comment.enterDateTime,
            pezDateTimeOffset: this.pezDateTimeOffset
          };

          pez.contents.push(pezContent);
        });
        break;
      case 3:
        pez.pezType = PezType.UserInteraction;
        this.interactions.forEach(interaction => {
          const pezContent: PezContent = {
            userName: interaction.userFullName,
            text: interaction.content,
            dateTime: interaction.enterDateTime,
            pezDateTimeOffset: this.pezDateTimeOffset
          };

          pez.contents.push(pezContent);
        });
        break;
      default:
        pez.pezType = PezType.Action;
        this.actions.forEach(item => {
          const pezContent = new PezContent();
          pezContent.userName = item.userFullName;
          pezContent.text = null;
          pezContent.dateTime = item.enterDateTime;
          pez.contents.push(pezContent);
        });
    }

    return pez;
  }

  onMouseEnterTriggerOpenPezDialog(e: Event, type: number): void {
    if (type !== PezType.UserInteraction + 1 || this.allowInteractionsHover) {
      this.dialog.closeAll();

      clearTimeout(this.timer);
      if (this.isPezDialogOpen === false) {
        this.timer = setTimeout(() => {
          this.isPezDialogOpen = true;
          this.openPezDialog(e, type);
        }, 500);
      }
    }
  }

  openPezDialog(e, type) {
    const dialogOptions: any = {
      height: 240,
      width: 400,
      position: {
        nextToTrigger: true,
        offset: {
          left: 5
        }
      },
      pointerClassName: 'dialog-arrow'
    };

    const pezData = this.generatePezContent(type);
    pezData.actionTitle = this.actionTitle;
    pezData.commentTitle = this.commentTitle;
    pezData.actionLogsTitle = this.actionLogsTitle;
    pezData.atText = this.atText;
    this.initPezDialog(e, dialogOptions, pezData);
  }

  initPezDialog(e: any, options: object, pezData: Pez): void {
    if (options['position'] !== undefined) {
      options['position']['trigger'] = e;
    }

    this.isPointerOnDialog = false;

    const opt = this.getCoordinates(options);
    const trigger = options['position']['trigger'];

    this.pezDialogRef = this.dialog.open(BrPezDialogComponent, {
      height: options['height'] + 'px',
      width: options['width'] + 'px',
      position: {
        top: opt['top'],
        left: opt['left']
      },
      panelClass: 'cdk-pez',
      backdropClass: 'cdk-overlay-pez',
      data: pezData
    });

    setTimeout(() => {
      const myDialog = document.querySelector('mat-dialog-container');

      myDialog.addEventListener('mouseover', () => {
        this.isPointerOnDialog = true;
      });

      myDialog.addEventListener('mouseout', () => {
        if (myDialog.parentElement.querySelector(':hover') !== myDialog) {
          clearTimeout(this.timer);
          this.pezDialogRef.close();
        }
      });
    }, 0);

    trigger.srcElement.classList.add('dialog-showen');
    trigger.srcElement.parentElement.parentElement.classList.add(
      'dialog-showen'
    );

    this.pezDialogRef.afterClosed().subscribe(result => {
      this.isPezDialogOpen = false;
      trigger.srcElement.classList.remove('dialog-showen');
      trigger.srcElement.parentElement.parentElement.classList.remove(
        'dialog-showen'
      );
    });
  }

  getCoordinates(options): object {
    const el = options.position.trigger;
    const triggerX = el.clientX - el.offsetX;
    const triggerY = el.clientY - el.offsetY;
    const gutter = options.position.offset.left;

    let top = triggerY - options.height / 2;

    switch (this.determinateY(options)) {
      case 'moveUp':
        top = triggerY - (options.height - 25);
        break;
    }

    let left = triggerX - gutter - options.width;

    if (left < 0) {
      left = triggerX + el.srcElement.clientWidth;
      this.hoverOnRight = true;
    } else {
      this.hoverOnRight = false;
    }

    return {
      top: top + 'px',
      left: left + 'px'
    };
  }

  determinateY(options): string {
    let pos = 'center';
    const dialogHeight = options.height;
    const triggerY =
      options.position.trigger.clientY - options.position.trigger.offsetY;
    const html = document.documentElement;

    if (
      triggerY + dialogHeight / 2 >=
      (window.innerHeight || html.clientHeight)
    ) {
      pos = 'moveUp';
    }

    return pos;
  }

  onMouseLeaveTriggerClosePezDialog(): void {
    setTimeout(() => {
      if (!this.isPointerOnDialog) {
        this.isPezDialogOpen = false;
        clearTimeout(this.timer);
        if (this.pezDialogRef != null) {
          this.pezDialogRef.close();
        }
      }
    }, 10);
  }

  onClickTriggerReviewSummaryDialog(event): void {
    this.dialog.closeAll();
    event.stopPropagation();
    this.showReviewSummaryDialog.emit(event);
  }
}
