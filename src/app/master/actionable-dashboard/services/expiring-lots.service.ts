// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { LabProduct } from '../../../contracts/models/lab-setup/product.model';
import { LabInstrument } from '../../../contracts/models/lab-setup/instrument.model';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import { QueryParameter } from '../../../shared/models/query-parameter';
import { urlPlaceholders } from '../../../core/config/constants/un-url-placeholder.const';
import { ExpiredLots } from '../../../contracts/models/actionable-dashboard/expired-lots.model';

@Injectable({
  providedIn: 'root'
})
export class ExpiringLotsService {

  constructor(private portalApiService: PortalApiService) { }

  public getExpiredLotsV2(locationId: string, groupedByDept: boolean): Observable<Array<ExpiredLots>> {
    return this.portalApiService.getExpiredLotsV2(locationId, groupedByDept);
  }

  getRenewedProducts(accountId: string, expirationDayLimit: string): Observable<LabProduct[]> {
    const queryParameters: QueryParameter[] = [
      new QueryParameter(urlPlaceholders.hasAncestor, accountId),
      new QueryParameter(urlPlaceholders.loadParent, urlPlaceholders.loadParent),
      new QueryParameter('FilterExpiredProductLots', expirationDayLimit)
    ];
    return this.portalApiService.listLabSetupNode<LabProduct>(LabProduct, queryParameters);
  }

  getLabProducts(accountId: string): Observable<LabInstrument[]> {
    const queryParameters: QueryParameter[] = [
      new QueryParameter(urlPlaceholders.hasAncestor, accountId),
      new QueryParameter(urlPlaceholders.loadChildren, urlPlaceholders.loadAllDescendants)
    ];
    return this.portalApiService.listLabSetupNode<LabInstrument>(LabInstrument, queryParameters);
  }

}
