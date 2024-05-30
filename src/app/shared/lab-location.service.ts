// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ApiService } from './api/api.service';
import { LabLocation } from '../contracts/models/lab-setup';
import { unApi } from '../core/config/constants/un-api-methods.const';
import { EntityType } from '../contracts/enums/entity-type.enum';
import { LabTree } from '../contracts/models/lab-setup/lab-tree.model';
import * as fromRoot from '../state/app.state';
import * as fromAuth from './state/selectors';
import { AuthState } from './state/reducers/auth.reducer';


@Injectable()
export class LabLocationService implements OnDestroy {
  protected labId: string;
  private destroy$ = new Subject<boolean>();

  constructor(
    private api: ApiService,
    private store: ngrxStore.Store<fromRoot.State>
  ) {
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!(authState && authState.isLoggedIn && authState.currentUser)), takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        if (authState && authState.isLoggedIn && authState.currentUser) {
          this.labId = authState.currentUser.accountNumber;
        }
      });
  }

  // Todo: Replace with portal api
  getLabLocationsByLab(labId: string): Observable<LabLocation[]> {
    let url = unApi.labLocation.labLocations;
    url = url.replace('{labId}', labId);
    return this.api.get(url);
  }

  getFirstLabLocationIdFromTree(labTree: LabTree): string {
    let labLocationId = '';
    if (this.labTreeHasLocation(labTree)) {
      labLocationId = this.getLabLocationIdFromTree(labTree);
    }
    return labLocationId;
  }

  private getLabLocationIdFromTree(labTree: LabTree): string {
    return labTree.children.find(lab => lab.nodeType === EntityType.Lab)
      .children.find(labLocation => labLocation.nodeType === EntityType.LabLocation)
      .id;
  }

  private labTreeHasLocation(labTree: LabTree): boolean {
    let hasLocation = false;
    if (labTree && labTree.children) {
      const labNode = labTree.children.find(lab => lab.nodeType === EntityType.Lab);
      if (labNode && labNode.children) {
        const labLocationNode = labNode.children.find(labLocation => labLocation.nodeType === EntityType.LabLocation);
        if (labLocationNode) {
          hasLocation = true;
        }
      }
    }
    return hasLocation;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
