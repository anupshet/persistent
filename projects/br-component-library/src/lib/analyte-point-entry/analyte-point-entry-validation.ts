import { FormControl } from '@angular/forms';
import { AnalytePointEntry } from '../contracts';

export const BrAnalytePointEntryValidation = {
  ErrorNames: {
    atLeastOneLevelEntered: 'atLeastOneLevelEntered'
  },
  atLeastOneLevelEntered: (formControl: FormControl): { [key: string]: boolean } => {
    const analyteEntry = formControl.value as (AnalytePointEntry);
    let isValid = false;
    if (!analyteEntry || !analyteEntry.levelDataSet) {
      return { atLeastOneLevel: true };
    }
    analyteEntry.levelDataSet.forEach(level => {
      if (level.data && level.data.value != null) {
        isValid = true;
      }
    });
    if (isValid) {
      return null;
    }
    return { atLeastOneLevel: true };
  }
};
