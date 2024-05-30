import { Header } from './header.model';
import { EntityType } from '../../enums/entity-type.enum';
import { AnalyteInfo } from './entity-info.model';

export class DataManagementInfo {
  entityId: string;
  entityType: EntityType;
  entityName: string;
  productMasterLotId: string;
  cumulativeAnalyteInfo: Array<AnalyteInfo>;
  headerData: Header;
  displayName: '';
}
