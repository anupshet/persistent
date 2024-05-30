import { Component, Input, OnChanges } from '@angular/core';

import { LevelToggleService } from './level-toggle.service';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-level-toggle',
  templateUrl: './level-toggle.component.html',
  styleUrls: ['./level-toggle.component.scss']
})
export class LevelToggleComponent implements OnChanges {
  @Input() levelsInUse: Array<number>;
  levelStates: Array<boolean>;

  constructor(
    private levelToggleService: LevelToggleService, private errorLoggerService: ErrorLoggerService
  ) { }

  ngOnChanges() {
    try {
      this.levelStates = Array<boolean>(this.levelsInUse.length);
      for (let i = 0; i < this.levelStates.length; i++) {
        this.levelStates[i] = true;
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelToggleComponent + blankSpace + Operations.GetLevelsInUse)));
    }
  }

  public onToggle(levelIndex: number): void {
    this.levelStates[levelIndex] = !this.levelStates[levelIndex];
    this.levelToggleService.levelStates.next(this.levelStates);
  }
}
