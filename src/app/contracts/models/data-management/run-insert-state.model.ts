import { CalibratorLot, ReagentLot } from 'br-component-library';

import { LevelValue } from './level-value.model';

export class RunInsertState {
  levelValues: Array<LevelValue>;
  selectedDateTime: Date;
  selectedReagentLot: ReagentLot;
  selectedCalibratorLot: CalibratorLot;
  isPastResultInsertAllowed: boolean;
  isLotVisible: boolean;
}
