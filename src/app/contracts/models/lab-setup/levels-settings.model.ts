import { Level } from '../portal-api/level-test-settings.model';

export class LevelSettings {
  id?: string;
  isSummary: boolean;
  decimalPlaces: number;
  level1Used: boolean;
  level2Used: boolean;
  level3Used: boolean;
  level4Used: boolean;
  level5Used: boolean;
  level6Used: boolean;
  level7Used: boolean;
  level8Used: boolean;
  level9Used: boolean;
  levels?: Array<Level>;
}
