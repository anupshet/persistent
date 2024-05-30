import { LabProduct } from './product.model';
import { ProductLot } from './product-lots-list-point.model';
import { LabInstrument } from './instrument.model';

export class DuplicateNodeEntry {
  sourceNode: LabProduct;
  userId: string;
  parentDisplayName: string;
  availableLots: ProductLot[];
}

export class DuplicateInstrumentEntry {
  sourceNode: LabInstrument;
}
