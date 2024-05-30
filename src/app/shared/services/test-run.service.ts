// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Analyte } from '../../contracts/models/lab-setup/analyte.model';
import { LabTest } from '../../contracts/models/lab-setup/test.model';
import { PortalApiService } from '../api/portalApi.service';
import { LevelLoadRequest } from '../../contracts/models/portal-api/labsetup-data.model';
import { CodelistApiService } from '../api/codelistApi.service';
import * as fromRoot from '../../state/app.state';
import * as fromAuth from '../state/selectors';
import { AuthState } from '../state/reducers/auth.reducer';
import { EntityType } from '../../contracts/enums/entity-type.enum';

@Injectable()
export class LabTestService implements OnDestroy {
  protected labId: string;
  private destroy$ = new Subject<boolean>();

  constructor(
    private portalApiService: PortalApiService,
    private store: ngrxStore.Store<fromRoot.State>,
    private codeListService: CodelistApiService
  ) {
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!(authState && authState.isLoggedIn && authState.currentUser)), takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        if (authState && authState.isLoggedIn && authState.currentUser) {
          this.labId = authState.currentUser.accountNumber;
        }
      });
  }

  public async getLabTest(id: string): Promise<LabTest> {
    return await this.portalApiService.getLabSetupNode<LabTest>(EntityType.LabTest, id, LevelLoadRequest.None).toPromise();
  }

  public putLabTest(labTest: LabTest): Observable<LabTest> {
    // Remove unnecessary properties from payload.
    delete labTest.testSpecInfo;
    delete labTest['accountSettings'];
    return this.portalApiService.upsertLabSetupNode<LabTest>(labTest, labTest.nodeType);
  }

  public async postLabTest(labTest: LabTest): Promise<LabTest> {
    // Remove unnecessary properties from payload.
    delete labTest.testSpecInfo;
    delete labTest['accountSettings'];
    return await this.portalApiService.upsertLabSetupNode<LabTest>(labTest, labTest.nodeType).toPromise();
  }

  public delTestRun(nodeType: EntityType, testRunId: string): Observable<boolean> {
    return this.portalApiService.deleteLabSetupNode(nodeType, testRunId);
  }

  public getAnalytes(productMasterLotId: number, instrumentId: number): Observable<Analyte[]> {
    return this.codeListService.getAnalytes(productMasterLotId, instrumentId);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
