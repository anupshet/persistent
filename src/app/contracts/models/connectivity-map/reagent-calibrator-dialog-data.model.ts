import { TestCard } from './map-card.model';
import { Chip } from './chip.model';

export class ReagentCalibratorDialogData {
    testCard: TestCard;
    chip: Chip;

    constructor(testCard: TestCard, chip: Chip) {
        this.testCard = testCard;
        this.chip = chip;
    }
}
