// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { unsubscribe } from '../../../core/helpers/rxjs-helper';
import { InstructionsService } from './instructions.service';

@Component({
  selector: 'unext-parsing-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit, OnDestroy {
  @Input() displayInstructionsForm;
  @Input() displayInstructionsList;
  @Input() accountId: string;
  @Input() existingInstructionNames: string[];

  private stepSubscription$: Subscription;
  showInstructionsForm: boolean;
  showInstructions: boolean;
  showList: boolean;


  constructor(private instructionsService: InstructionsService) {}

  ngOnInit() {
    this.stepSubscription$ = this.instructionsService
    .getNextBtnState()
    .subscribe(res => {
      this.showInstructionsForm = res;
    });
  }

  ngOnDestroy(): void {
    unsubscribe(this.stepSubscription$);
  }
}
