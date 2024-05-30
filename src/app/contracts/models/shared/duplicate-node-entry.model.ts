// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { LabProduct } from '../lab-setup';
import { ProductLot } from '../lab-setup/product-lots-list-point.model';

export class DuplicateNodeEntry {
  sourceNode: LabProduct;
  userId: string;
  parentDisplayName: string;
  availableLots: ProductLot[];
}
