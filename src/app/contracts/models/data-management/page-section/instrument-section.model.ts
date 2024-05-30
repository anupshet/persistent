import { LabInstrument } from '../../lab-setup/instrument.model';
import { AnalyteInfo } from '../entity-info.model';
import { LabProduct } from '../../lab-setup/product.model';
import { TreePill } from '../../lab-setup';

export class InstrumentSection {
  instrument: LabInstrument;
  productSections: Array<ProductSection>;
  panelSections?: Array<PanelSection>;
}

export class ProductSection {
  product: LabProduct;
  analyteSections: Array<AnalyteSection>;
}

export class AnalyteSection {
  analyteInfo: AnalyteInfo;
  productName?: string;
  lotNumber?: string;
}

export class PanelSection {
  panel: TreePill;
}
