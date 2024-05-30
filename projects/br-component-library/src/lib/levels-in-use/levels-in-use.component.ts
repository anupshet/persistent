import { Component, OnInit, Input, ChangeDetectionStrategy, forwardRef, OnChanges, SimpleChanges,
   Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS } from '@angular/forms';

import { Level } from '../contracts/models/level-data.model';

@Component({
  selector: 'br-levels-in-use',
  templateUrl: './levels-in-use.component.html',
  styleUrls: ['./levels-in-use.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrLevelsInUseComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BrLevelsInUseComponent),
      multi: true,
    }
  ]
})
export class BrLevelsInUseComponent implements OnInit, ControlValueAccessor, OnChanges {

  @Input() levels: Array<Level> = [];
  @Input() maxLevelInUse = 4;
  @Output() selectedChanged = new EventEmitter();

  public _levels: Array<Level>;
  public invalid: boolean;
  public numberOfLevelsInUse: number;
  public levelsGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  get levelCheckboxes() {
    return this.levelsGroup.get('levelCheckboxes') as FormArray;
  }

  get value() {
    return this._levels;
  }

  set value(val: Array<Level>) {
    this._levels = val;
    this.emitSelected();
    this.onChange(val);
    this.onTouched(val);
  }

  emitSelected() {
    if (this.levels) {
      this.selectedChanged.emit(this._levels);
    }
  }

  onChange = (levels: Array<Level>) => { };
  onTouched = (levels: Array<Level>) => { };

  writeValue(val: Array<Level>): void {
    this.value = val;
  }

  registerOnChange(fn): void {
    this.onChange = fn;
  }

  registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  public validate(c: FormControl) {
    return (!this.invalid) ? null : { 'incorrect': true };
  }

  public addLevel(value: boolean): FormGroup {
    return this.formBuilder.group({
      level: new FormControl(value)
    });
  }

  ngOnInit() {
    this.writeValue(this.levels);
    this.levelsGroup = this.formBuilder.group({
      levelCheckboxes: this.formBuilder.array([])
    });

    this.value.forEach(level => {
      this.levelCheckboxes.push(this.addLevel(level.levelInUse ? true : false));
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.writeValue(this.levels);
    this.levelsGroup = this.formBuilder.group({
      levelCheckboxes: this.formBuilder.array([])
    });

    this.value.forEach(level => {
      this.levelCheckboxes.push(this.addLevel(level.levelInUse ? true : false));
    });
  }

  public onChangeLevelInUse(): void {
    const levels = new Array<Level>();
    this.levelCheckboxes.controls.forEach((control, index) => {
      levels.push({
        id: 0,
        levelInUse: control.value.level,
        decimalPlace: index + 1
      });
    });
    this.writeValue(levels);

    this.levelInUseDisable();
    this.setEnabledLevels();
  }

  public levelInUseDisable(): void {
    this.numberOfLevelsInUse = this.levelCheckboxes.controls.filter(x => x.value.level).length;

    if (this.numberOfLevelsInUse < this.maxLevelInUse) {
      for (let i = 0; i < this.levelCheckboxes.controls.length; i++) {
        this.levelCheckboxes.controls[i].enable();
      }
    } else {
      for (let i = 0; i < this.levelCheckboxes.controls.length; i++) {
        if (this.levelCheckboxes.controls[i].value.level) {
          this.levelCheckboxes.controls[i].enable();
        } else {
          this.levelCheckboxes.controls[i].disable();
        }
      }
    }
    this.invalid = this.numberOfLevelsInUse <= 0;
  }

  public setEnabledLevels(): void {
    const enabledLevels = this.levelCheckboxes.controls.filter(lv => lv.value.level);
    if (enabledLevels.length === 1) {
      const lastEnabledLevelIndex = this.levelCheckboxes.controls.findIndex(lv => lv.value.level);
      this.levelCheckboxes.controls[lastEnabledLevelIndex].disable();
    } else {
      this.levelCheckboxes.controls.forEach(control => {
        control.enable();
      });
    }
  }
}
