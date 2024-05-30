// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Observable } from 'rxjs';
import { Account, AccountPageResponse, AccountPageRequest } from '../models/account-management/account';
import { TreePill } from '../models/lab-setup/tree-pill.model';
import { LocationPage, LocationSearchRequest } from '../models/account-management/location-page.model';
import { LabLocation } from '../models/lab-setup/lab-location.model';
import { Lab } from '../models/lab-setup/lab.model';
import { EntityType } from '../enums/entity-type.enum';
import { LabTree } from '../models/lab-setup/lab-tree.model';


export interface IAccountManagementAPIService {
  searchAccounts<T extends AccountPageResponse>(accountPageRequest: AccountPageRequest): Observable<T>;
  getGroups(nodeType: EntityType, accountId: string): Observable<LabTree>;
  addAccount<T extends TreePill>(account: Account): Observable<T>;
  updateAccount<T extends TreePill>(account: Account): Observable<T>;
  deleteAccount<T extends TreePill>(accountId: string): Observable<T>;
  searchLocations<T extends LocationPage>(locationSearchRequest: LocationSearchRequest): Observable<T>;
  addLocation<T extends LabLocation>(location: LabLocation): Observable<T>;
  updateLocation<T extends LabLocation>(location: LabLocation): Observable<T>;
  addGroup<T extends TreePill>(group: Lab): Observable<T>;
  deleteUser<T extends TreePill>(userId: string): Observable<T>;
}
