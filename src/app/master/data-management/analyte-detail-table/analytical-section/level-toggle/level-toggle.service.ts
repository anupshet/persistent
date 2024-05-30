import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class LevelToggleService {
  levelStates = new Subject<Array<boolean>>();
}
