// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Observable } from 'rxjs/internal/Observable';

import { Settings } from '../models/lab-setup/settings.model';
import { EntityType } from '../enums/entity-type.enum';

export interface ILabSettingsAPIService {

  updateSettings(nodeType: EntityType, settings: Settings): Observable<Settings>;

  createSettings(nodeType: EntityType, settings: Settings): Observable<Settings>;

  getSettings(nodeType: EntityType, entityId: string, parentEntityId: string): Observable<Settings>;
}
