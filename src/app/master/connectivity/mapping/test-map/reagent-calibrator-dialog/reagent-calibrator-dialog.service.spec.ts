// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestBed } from '@angular/core/testing';

import { ReagentCalibratorDialogService } from './reagent-calibrator-dialog.service';
import { ReagentCalibratorDialogData } from '../../../../../contracts/models/connectivity-map/reagent-calibrator-dialog-data.model';
import { Chip } from '../../../../../contracts/models/connectivity-map/chip.model';
import { TestCard } from '../../../../../contracts/models/connectivity-map/map-card.model';

describe('ReagentCalibratorService', () => {

    let reagentCalibratorSvc: ReagentCalibratorDialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ReagentCalibratorDialogService
            ]
        }).compileComponents();

        reagentCalibratorSvc = TestBed.get(ReagentCalibratorDialogService);
    });

    it('should verify the array is null', () => {
        const nullArray: string[] = null;
        const nullResult: boolean = reagentCalibratorSvc.arrayIsNotEmpty(nullArray);
        expect(nullResult).toBeFalsy();
    });

    it('should verify the array is empty', () => {
        const emptyArray: string[] = [];
        const emptyResult: boolean = reagentCalibratorSvc.arrayIsNotEmpty(emptyArray);
        expect(emptyResult).toBeFalsy();
    });

    it('should verify the array is valid', () => {
        const validArray: string[] = ['test'];
        const validResult: boolean = reagentCalibratorSvc.arrayIsNotEmpty(validArray);
        expect(validResult).toBeTruthy();
    });

    // only getting first result for Base. This will need to be updated later to return multiple
    // once that is implemented
    it('should get the first calibrator lot code found (for Base)', () => {
        const chip = new Chip();
        const testCard = new TestCard();
        const dialogData = new ReagentCalibratorDialogData(testCard, chip);

        // test null
        dialogData.chip.calibratorLotCodes = null;
        const nullCalibratorLotCodeResult: string = reagentCalibratorSvc.getCalibratorLotCode(dialogData);
        expect(nullCalibratorLotCodeResult).toBeNull();
        // test empty
        dialogData.chip.calibratorLotCodes = [];
        const emptyCalibratorLotCodeResult: string = reagentCalibratorSvc.getCalibratorLotCode(dialogData);
        expect(emptyCalibratorLotCodeResult).toBeNull();
        // test valid
        const arrayValOne = 'one';
        const arrayValTwo = 'two';
        dialogData.chip.calibratorLotCodes = [{ code: arrayValOne }, { code: arrayValTwo }];
        const validCalibratorLotCodeResult: string = reagentCalibratorSvc.getCalibratorLotCode(dialogData);
        expect(validCalibratorLotCodeResult).toBe(arrayValOne);
    });

    it('should get the all reagent lot codes found (for Base)', () => {
        const chip = new Chip();
        const testCard = new TestCard();
        const dialogData = new ReagentCalibratorDialogData(testCard, chip);

        // test null
        dialogData.chip.reagentLotCodes = null;
        const nullReagentLotCodeResult: string = reagentCalibratorSvc.getReagentLotCode(dialogData);
        expect(nullReagentLotCodeResult).toBeNull();
        // test empty
        dialogData.chip.reagentLotCodes = [];
        const emptyReagentLotCodeResult: string = reagentCalibratorSvc.getReagentLotCode(dialogData);
        expect(emptyReagentLotCodeResult).toBeNull();
        // test valid
        const arrayValOne = 'one';
        const arrayValTwo = 'two';
        dialogData.chip.reagentLotCodes = [{ code: arrayValOne }, { code: arrayValTwo }];
        const validReagentLotCodeResult = reagentCalibratorSvc.getReagentLotCode(dialogData);
        expect(validReagentLotCodeResult).toBe(dialogData.chip.reagentLotCodes);
    });

    it('should return true if a calibrator lot code exists', () => {
        const chip = new Chip();
        const testCard = new TestCard();
        const dialogData = new ReagentCalibratorDialogData(testCard, chip);

        // test null
        dialogData.chip.calibratorLotCodes = null;
        const nullCalibratorLotCodeResult: boolean = reagentCalibratorSvc.calibratorLotCodeExists(dialogData.chip.calibratorLotCodes);
        expect(nullCalibratorLotCodeResult).toBeFalsy();
        // test empty
        dialogData.chip.calibratorLotCodes = [];
        const emptyCalibratorLotCodeResult: boolean = reagentCalibratorSvc.calibratorLotCodeExists(dialogData.chip.calibratorLotCodes);
        expect(emptyCalibratorLotCodeResult).toBeFalsy();
        // test valid
        const arrayValOne = 'one';
        const arrayValTwo = 'two';
        dialogData.chip.calibratorLotCodes = [{ code: arrayValOne }, { code: arrayValTwo }];
        const validCalibratorLotCodeResult: boolean = reagentCalibratorSvc.calibratorLotCodeExists(dialogData.chip.calibratorLotCodes);
        expect(validCalibratorLotCodeResult).toBeTruthy();
    });

    it('should return true if a reagent lot code exists', () => {
        const chip = new Chip();
        const testCard = new TestCard();
        const dialogData = new ReagentCalibratorDialogData(testCard, chip);

        // test null
        dialogData.chip.reagentLotCodes = null;
        const nullReagentLotCodeResult: boolean = reagentCalibratorSvc.reagentLotCodeExists(dialogData.chip.reagentLotCodes);
        expect(nullReagentLotCodeResult).toBeFalsy();
        // test empty
        dialogData.chip.reagentLotCodes = [];
        const emptyReagentLotCodeResult: boolean = reagentCalibratorSvc.reagentLotCodeExists(dialogData.chip.reagentLotCodes);
        expect(emptyReagentLotCodeResult).toBeFalsy();
        // test valid
        const arrayValOne = 'one';
        const arrayValTwo = 'two';
        dialogData.chip.reagentLotCodes = [{ code: arrayValOne }, { code: arrayValTwo }];
        const validReagentLotCodeResult: boolean = reagentCalibratorSvc.reagentLotCodeExists(dialogData.chip.reagentLotCodes);
        expect(validReagentLotCodeResult).toBeTruthy();
    });

    it('should return true if both lot codes exist', () => {
        const chip = new Chip();
        const testCard = new TestCard();
        const dialogData = new ReagentCalibratorDialogData(testCard, chip);

        // test none
        dialogData.chip.reagentLotCodes = null;
        dialogData.chip.calibratorLotCodes = null;
        const noLotCodes: boolean = reagentCalibratorSvc.bothLotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(noLotCodes).toBeFalsy();

        // test reagent only
        dialogData.chip.reagentLotCodes = [{ code: 'test' }];
        dialogData.chip.calibratorLotCodes = null;
        const reagentOnly: boolean = reagentCalibratorSvc.bothLotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(reagentOnly).toBeFalsy();

        // test calibrator only
        dialogData.chip.reagentLotCodes = null;
        dialogData.chip.calibratorLotCodes = [{ code: 'test' }];
        const calibratorOnly: boolean = reagentCalibratorSvc.bothLotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(calibratorOnly).toBeFalsy();

        // test both
        dialogData.chip.reagentLotCodes = [{ code: 'two' }];
        dialogData.chip.calibratorLotCodes = [{ code: 'test' }];
        const bothCodes: boolean = reagentCalibratorSvc.bothLotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(bothCodes).toBeTruthy();
    });

    it('should return true if no lot codes exist', () => {
        const chip = new Chip();
        const testCard = new TestCard();
        const dialogData = new ReagentCalibratorDialogData(testCard, chip);

        // test none
        dialogData.chip.reagentLotCodes = null;
        dialogData.chip.calibratorLotCodes = null;
        const noLotCodes: boolean = reagentCalibratorSvc.noLotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(noLotCodes).toBeTruthy();

        // test reagent only
        dialogData.chip.reagentLotCodes = [{ code: 'test' }];
        dialogData.chip.calibratorLotCodes = null;
        const reagentOnly: boolean = reagentCalibratorSvc.noLotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(reagentOnly).toBeFalsy();

        // test calibrator only
        dialogData.chip.reagentLotCodes = null;
        dialogData.chip.calibratorLotCodes = [{ code: 'test' }];
        const calibratorOnly: boolean = reagentCalibratorSvc.noLotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(calibratorOnly).toBeFalsy();

        // test both
        dialogData.chip.reagentLotCodes = [{ code: 'two' }];
        dialogData.chip.calibratorLotCodes = [{ code: 'test' }];
        const bothCodes: boolean = reagentCalibratorSvc.noLotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(bothCodes).toBeFalsy();
    });

    it('should return true if any lot codes exist', () => {
        const chip = new Chip();
        const testCard = new TestCard();
        const dialogData = new ReagentCalibratorDialogData(testCard, chip);

        // test none
        dialogData.chip.reagentLotCodes = null;
        dialogData.chip.calibratorLotCodes = null;
        const noLotCodes: boolean = reagentCalibratorSvc.lotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(noLotCodes).toBeFalsy();

        // test reagent only
        dialogData.chip.reagentLotCodes = [{ code: 'test' }];
        dialogData.chip.calibratorLotCodes = null;
        const reagentOnly: boolean = reagentCalibratorSvc.lotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(reagentOnly).toBeTruthy();

        // test calibrator only
        dialogData.chip.reagentLotCodes = null;
        dialogData.chip.calibratorLotCodes = [{ code: 'test' }];
        const calibratorOnly: boolean = reagentCalibratorSvc.lotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(calibratorOnly).toBeTruthy();

        // test both
        dialogData.chip.reagentLotCodes = [{ code: 'two' }];
        dialogData.chip.calibratorLotCodes = [{ code: 'test' }];
        const bothCodes: boolean = reagentCalibratorSvc.lotCodesExist(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(bothCodes).toBeTruthy();
    });

    it('should return true if only calibrator lot codes exist', () => {
        const chip = new Chip();
        const testCard = new TestCard();
        const dialogData = new ReagentCalibratorDialogData(testCard, chip);

        // test none
        dialogData.chip.reagentLotCodes = null;
        dialogData.chip.calibratorLotCodes = null;
        const noLotCodes: boolean = reagentCalibratorSvc.onlyCalibratorLotCodeExists(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(noLotCodes).toBeFalsy();

        // test reagent only
        dialogData.chip.reagentLotCodes = [{ code: 'test' }];
        dialogData.chip.calibratorLotCodes = null;
        const reagentOnly: boolean = reagentCalibratorSvc.onlyCalibratorLotCodeExists(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(reagentOnly).toBeFalsy();

        // test calibrator only
        dialogData.chip.reagentLotCodes = null;
        dialogData.chip.calibratorLotCodes = [{ code: 'test' }];
        const calibratorOnly: boolean = reagentCalibratorSvc.onlyCalibratorLotCodeExists(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(calibratorOnly).toBeTruthy();

        // test both
        dialogData.chip.reagentLotCodes = [{ code: 'two' }];
        dialogData.chip.calibratorLotCodes = [{ code: 'test' }];
        const bothCodes: boolean = reagentCalibratorSvc.onlyCalibratorLotCodeExists(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(bothCodes).toBeFalsy();
    });

    it('should return true if only reagent lot codes exist', () => {
        const chip = new Chip();
        const testCard = new TestCard();
        const dialogData = new ReagentCalibratorDialogData(testCard, chip);

        // test none
        dialogData.chip.reagentLotCodes = null;
        dialogData.chip.calibratorLotCodes = null;
        const noLotCodes: boolean = reagentCalibratorSvc.onlyReagentLotCodeExists(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(noLotCodes).toBeFalsy();

        // test reagent only
        dialogData.chip.reagentLotCodes = [{ code: 'test' }];
        dialogData.chip.calibratorLotCodes = null;
        const reagentOnly: boolean = reagentCalibratorSvc.onlyReagentLotCodeExists(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(reagentOnly).toBeTruthy();

        // test calibrator only
        dialogData.chip.reagentLotCodes = null;
        dialogData.chip.calibratorLotCodes = [{ code: 'test' }];
        const calibratorOnly: boolean = reagentCalibratorSvc.onlyReagentLotCodeExists(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(calibratorOnly).toBeFalsy();

        // test both
        dialogData.chip.reagentLotCodes = [{ code: 'two' }];
        dialogData.chip.calibratorLotCodes = [{ code: 'test' }];
        const bothCodes: boolean = reagentCalibratorSvc.onlyReagentLotCodeExists(
            dialogData.chip.calibratorLotCodes, dialogData.chip.reagentLotCodes);
        expect(bothCodes).toBeFalsy();
    });

});
