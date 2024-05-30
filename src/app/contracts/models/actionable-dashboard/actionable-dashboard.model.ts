import { EntityType } from '../../enums/entity-type.enum';
import { ActionableItem } from './actionableItem.model';
import { LabInstrument } from '../lab-setup';

// New For AWS Switch
export class LotRenewalPayload {
  id?: string;
  nodeType: EntityType;
  productMasterLotId?: string;
}

export class LotRenewal {
  selectedLot: ActionableItem;
  selectedInstruments: Array<LabInstrument>;
}
