// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { Codes } from '../../../../../contracts/models/connectivity-map/connectivity-map-tree.model';
import { ReagentCalibratorDialogData } from '../../../../../contracts/models/connectivity-map/reagent-calibrator-dialog-data.model';

@Injectable()
export class ReagentCalibratorDialogService {

    arrayIsNotEmpty(array: Array<any>): boolean {
        return Array.isArray(array) && array.length > 0;
    }

    // this is returning one result for base. Should return multiple later on.
    getCalibratorLotCode(data: ReagentCalibratorDialogData): string {
        let calibratorCode = null;
        if (data
            && data.chip
            && data.chip.calibratorLotCodes
            && data.chip.calibratorLotCodes.length > 0) {
            calibratorCode = data.chip.calibratorLotCodes[0].code;
        }
        return calibratorCode;
    }

    getReagentLotCode(data: ReagentCalibratorDialogData) {
        let reagentCode = null;
        if (data
            && data.chip
            && data.chip.reagentLotCodes
            && data.chip.reagentLotCodes.length > 0) {
            reagentCode = data.chip.reagentLotCodes;
        }
        return reagentCode;
    }

    bothLotCodesExist(calibratorLotCodes: Array<Codes>, reagentLotCodes: Array<Codes>): boolean {
        return this.calibratorLotCodeExists(calibratorLotCodes) && this.reagentLotCodeExists(reagentLotCodes);
    }

    noLotCodesExist(calibratorLotCodes: Array<Codes>, reagentLotCodes: Array<Codes>): boolean {
        return !this.calibratorLotCodeExists(calibratorLotCodes) && !this.reagentLotCodeExists(reagentLotCodes);
    }

    lotCodesExist(calibratorLotCodes: Array<Codes>, reagentLotCodes: Array<Codes>): boolean {
        return !this.noLotCodesExist(calibratorLotCodes, reagentLotCodes);
    }

    onlyCalibratorLotCodeExists(calibratorLotCodes: Array<Codes>, reagentLotCodes: Array<Codes>): boolean {
        return this.calibratorLotCodeExists(calibratorLotCodes) && !this.reagentLotCodeExists(reagentLotCodes);
    }

    onlyReagentLotCodeExists(calibratorLotCodes: Array<Codes>, reagentLotCodes: Array<Codes>): boolean {
        return this.reagentLotCodeExists(reagentLotCodes) && !this.calibratorLotCodeExists(calibratorLotCodes);
    }

    calibratorLotCodeExists(calibratorLotCodes: Array<Codes>): boolean {
        return this.arrayIsNotEmpty(calibratorLotCodes);
    }

    reagentLotCodeExists(reagentLotCodes: Array<Codes>): boolean {
        return this.arrayIsNotEmpty(reagentLotCodes);
    }
}
