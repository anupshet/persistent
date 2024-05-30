import { Observable } from 'rxjs';

import { TreePill } from '../models/lab-setup/tree-pill.model';
import { Panel } from '../models/panel/panel.model';

export interface IPanelsAPIService {
  addPanelData<T extends TreePill>(panel: Array<Panel>): Observable<T[]>;

  updatePanelData<T extends TreePill>(panel: Array<Panel>): Observable<T[]>;
}
