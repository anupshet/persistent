import { RawDataType } from '../data-management/base-raw-data.model';
import { EntityType } from '../../enums/entity-type.enum';

export class Target {
  controlLotId: string;
  controlLevel: string;
  mean: number;
  sd: number;
  points: number;
}

export class Rule {
  id: string;
  category: string;
  k: string;
  disposition: string;
}

export class Level {
  levelInUse: boolean;
  decimalPlace: number;
}

export class LevelDisplayItem extends Level {
  disabled: boolean;
}


export class LevelSelection{
  level: number;
  isSelected: boolean;
}

/* Currently connectivity and data-management still refers the old class definition.+
//  TO DO: need to be modified later with the new class definition
*/
export class LevelSettingsDto {
  id?: string;
  parentNodeId?: string;
  parentNode?: string;
  nodeType?: EntityType;
  displayName?: string;
  children?: [];
  levelEntityId?: string;
  levelEntityName?: string;
  parentLevelEntityId?: string;
  parentLevelEntityName?: string;
  minNumberOfPoints?: number;
  runLength?: number;
  dataType?: RawDataType;
  targets?: Array<Target>;
  rules?: Array<Rule>;
  levels?: Array<Level>;
  isSummary?: boolean;
  decimalPlaces?: number;
  level1Used?: boolean;
  level2Used?: boolean;
  level3Used?: boolean;
  level4Used?: boolean;
  level5Used?: boolean;
  level6Used?: boolean;
  level7Used?: boolean;
  level8Used?: boolean;
  level9Used?: boolean;
}
