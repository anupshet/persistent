import { Observable } from 'rxjs';

import { CodeList } from './models/code-list.model';
import { Department } from './models/lab-setup/department.model';
import { LabInstrument } from './models/lab-setup/instrument.model';
import { LabLocation } from './models/lab-setup/lab-location.model';
import { Lab } from './models/lab-setup/lab.model';
import { LabProduct } from './models/lab-setup/product.model';
import { LabTest } from './models/lab-setup/test.model';

export interface NodeService {
  getDetailsById(
    id: number,
    codeList?: CodeList
  ): Observable<Lab | LabLocation | Department | LabInstrument | LabProduct | LabTest>;
}
