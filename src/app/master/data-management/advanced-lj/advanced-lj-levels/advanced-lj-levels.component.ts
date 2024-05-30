// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { LevelSelection } from '../../../../contracts/models/data-management/advanced-lj/level-selection.model';

@Component({
  selector: 'unext-advanced-lj-levels',
  templateUrl: './advanced-lj-levels.component.html',
  styleUrls: ['./advanced-lj-levels.component.scss']
})
export class AdvancedLjLevelsComponent implements OnInit {
  @Input()
  set levelsInUse(levelsInUse: Array<number>) {
    if (levelsInUse) {
      this.resetLevels(levelsInUse);
    }
  }
  @Output() selectedLevels: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() isOverlayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public levels: Array<LevelSelection>;
  public isOverlayChecked = false;
  public isOverlayEnabled = false;
  public formControl: any;

  constructor(private appLoggerService: AppLoggerService) { }

  ngOnInit(): void { }

  public resetLevels(levelsInUse: Array<number>): void {
    this.levels = new Array<LevelSelection>();
    levelsInUse.forEach(l => {
      this.levels.push({
        levelNumber: l,
        isSelected: true      // By default, all levels are checked
      });
    });

    this.isOverlayEnabled = levelsInUse && levelsInUse.length > 0;
  }

  public onLevelChange(): void {
    let levelsWithCheckMarks = this.getSelectedLevels(this.levels);
    this.selectedLevels.emit(levelsWithCheckMarks);
    this.appLoggerService.log('Selected levels:' + levelsWithCheckMarks);
  }

  public onIsOverlayChange(): void {
    this.isOverlayChange.emit(this.isOverlayChecked);
    this.appLoggerService.log('isOverlayChecked: ' + this.isOverlayChecked);
  }

  public getSelectedLevels(levels: Array<LevelSelection>): Array<number> {
    return levels
      .filter(l => l.isSelected)
      .map(l => l.levelNumber);
  }
}
