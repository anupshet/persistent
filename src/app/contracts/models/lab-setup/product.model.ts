// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { LabTest } from './test.model';
import { TreePill } from './tree-pill.model';
import { EntityType } from '../../enums/entity-type.enum';
import { ProductMasterLot, Product, QCProductLot } from '../portal-api/labsetup-data.model';
import { LabInstrument } from './instrument.model';
import { LevelSettingsDto } from '../portal-api/level-test-settings.model';

export class LabProduct extends TreePill {
  manufacturerId?: string;
  children: LabTest[];
  nodeType = EntityType.LabProduct;
  productId?: string;
  productMasterLotId?: string;
  productCustomName?: string;
  productInfo?: Product;
  lotInfo?: ProductMasterLot;
  parentNode?: LabInstrument;
  levelSettings?: LevelSettingsDto;
  productLotLevels?: QCProductLot[];
  isArchived?: boolean;
  typeOfOperation?:boolean;
}
