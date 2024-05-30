// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Observable } from 'rxjs';

import { AppUser } from '../../security/model';
import { BioRadUser, BioRadUserPageRequest, BioRadUserPageResponse } from '../models/biorad-user-management/bio-rad-user.models';

export interface IBioRadUserManagementAPIService {
  searchBioRadUsers<T extends BioRadUserPageResponse>(bioRadUserPageRequest: BioRadUserPageRequest): Observable<T>;
  addBioRadUser<T extends AppUser>(bioRadUserData: BioRadUser): Observable<T>;
  updateBioRadUser<T extends AppUser>(bioRadUserData: BioRadUser): Observable<T>;
  deleteBioRadUser<T extends BioRadUser>(bioRadUserId: string): Observable<T>;
}
