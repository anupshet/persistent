// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CalibratorLot, ReagentLot } from 'br-component-library';

import { ICodeListAPIService } from '../../contracts/interfaces/i-code-list-api.service';
import { TestInfo } from '../../contracts/models/codelist-management/test-info.model';
import { UserAction } from '../../contracts/models/codelist-management/user-action.model';
import { TestSpecInfo } from '../../contracts/models/data-management/run-data.model';
import { ReagentLot as CodeListReagentLot } from '../../contracts/models/lab-setup/reagent-lot.model';
import { CalibratorLot as CodeListCalibratorLot } from '../../contracts/models/lab-setup/calibrator-lot.model';
import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { ApiService } from './api.service';
import { TestSpec } from '../../contracts/models/portal-api/labsetup-data.model';
import { ProductLot } from '../../contracts/models/lab-setup/product-lots-list-point.model';
import { ManufacturerProduct } from '../../contracts/models/lab-setup/product-list.model';
import { Manufacturer } from '../../contracts/models/lab-setup/manufacturer.model';
import { LabInstrumentListPoint } from '../../contracts/models/lab-setup/instrument-list-point.model';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import { Unit } from '../../contracts/models/codelist-management/unit.model';
import { Reagent } from '../../contracts/models/codelist-management/reagent.model';
import { Analyte } from '../../contracts/models/lab-setup/analyte.model';
import { Method } from '../../contracts/models/lab-setup/method.model';
import { Calibrator } from '../../contracts/models/lab-setup/calibrator.model';
import { SpinnerService } from '../services/spinner.service';
import * as fromRoot from '../../state/app.state';
import { TestSpecsByIds } from '../models/test-specs-by-ids.model';
import { Matrix } from '../../contracts/models/lab-setup/matrix.model';
import { CustomControl } from '../../contracts/models/control-management/custom-control.model'
import { CustomControlMasterLot } from '../../contracts/models/control-management/custom-control-master-lot.model';

const params = unApi.codelistManagement.queryStringParams;

@Injectable()
export class CodelistApiService extends ApiService
  implements ICodeListAPIService {
  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    if (config.getConfig('api')) {
      this.apiUrl = (<ApiConfig>config.getConfig('api')).codelistUrl;
    }
  }

  private _testSpecInfoCache: TestSpecInfo[] = [];
  private _testInfoCache: TestInfo[] = [];
  private _matrixCache: Matrix[] = [];

  getProductMasterLotsByProductId(productId: string): Observable<ProductLot[]> {
    const url = unApi.codelistManagement.productMasterLotsByProductId.replace(urlPlaceholders.productId, productId);
    return this.get(url, null, true);
  }

  getProductsByInstrumentAndLocationId(
    instrumentId: string,
    locationId: string
  ): Observable<ManufacturerProduct[]> {
    const url = unApi.codelistManagement.productsByInstrumentAndLocationId
      .replace(urlPlaceholders.instrumentId, instrumentId).replace(urlPlaceholders.locationId, locationId);
    return this.get<ManufacturerProduct[]>(url).pipe(map(this.getListWithStringIds));
  }


  // Use TestRunService.getTestRunById to Reagent id from TestId
  // TODO: Refactor this. In CodeListApiService, we shouldn't be returning a model that is in the component library.
  // AJT 06152022 bug fix UN7535 add spinner
  public getReagentLotsByReagentIdAsync(
    reagentId: string, doNotshowBusy?: boolean
  ): Promise<ReagentLot[]> {
    const url = unApi.codelistManagement.reagentLot.replace(
      '{reagentId}',
      reagentId
    );
    return this.get<ReagentLot[]>(url, null, doNotshowBusy).toPromise();
  }

  // AJT 06152022 bug fix UN7535 add spinner
  public getReagentLotsByReagentId(reagentId: string): Observable<CodeListReagentLot[]> {
    const url = unApi.codelistManagement.reagentLot.replace(
      urlPlaceholders.reagentId,
      reagentId
    );
    return this.get<CodeListReagentLot[]>(url, null, true);
  }

  public getReagentLotsMapByTestIds(codeListTestIds: string[]): Observable<Map<string, CodeListReagentLot[]>> {
    const url = unApi.codelistManagement.reagentLotsByTestIds;
    return this.post<Map<string, CodeListReagentLot[]>>(url, codeListTestIds);
  }

  public getCalibratorLotsMapByTestIds(codeListTestIds: string[]): Observable<Map<string, CodeListCalibratorLot[]>> {
    const url = unApi.codelistManagement.calibratorLotsByTestIds;
    return this.post<Map<string, CodeListCalibratorLot[]>>(url, codeListTestIds);
  }

  // TODO: Refactor this. In CodeListApiService, we shouldn't be returning a model that is in the component library.
  // AJT 06152022 bug fix UN7535 add spinner
  public getCalibratorLotsByCalibratorIdAsync(
    calibratorId: string, doNotshowBusy?: boolean
  ): Promise<CalibratorLot[]> {
    const url = unApi.codelistManagement.calibratorLot.replace(
      '{calibratorId}',
      calibratorId
    );
    return this.get<CalibratorLot[]>(url, null, doNotshowBusy).toPromise();
  }

  // AJT 06152022 bug fix UN7535 add spinner
  public getCalibratorLotsByCalibratorId(calibratorId: string): Observable<CodeListCalibratorLot[]> {
    const url = unApi.codelistManagement.calibratorLot.replace(
      urlPlaceholders.calibratorId,
      calibratorId
    );
    return this.get<CodeListCalibratorLot[]>(url, null,true);
  }

  public async getTestSpecIdAsync(
    analyteId: string,
    methodId: string,
    instrumentId: string,
    reagentLotId: string,
    unitId: string,
    calibratorLotId: string
  ): Promise<string> {
    const url = unApi.codelistManagement.testSpecSearch
      .replace('{analyteId}', analyteId)
      .replace('{methodId}', methodId)
      .replace('{instrumentId}', instrumentId)
      .replace('{reagentLotId}', reagentLotId)
      .replace('{unitId}', unitId)
      .replace('{calibratorLotId}', calibratorLotId);
    return await this.get<string>(url).toPromise();
  }

  public async getTestSpecByIdAsync(testSpecId: string): Promise<TestSpecInfo> {
    const existsInCache: TestSpecInfo = this.getTestSpecInfoFromCache(
      Number(testSpecId)
    );

    if (existsInCache) {
      return existsInCache;
    } else {
      return await this.getTestSpecInfoFromCodeListAsync(testSpecId);
    }
  }

  public async getTestSpecInfoFromCodeListAsync(
    testSpecId: string
  ): Promise<TestSpecInfo> {
    const url = unApi.codelistManagement.testSpec.replace(
      '{testSpecId}',
      testSpecId
    );

    await this.get<TestSpecInfo>(url)
      .toPromise()
      .then(data => {
        this._testSpecInfoCache.push(data);
      });
    return this.getTestSpecInfoFromCache(Number(testSpecId));
  }

  public async getTestByIdAsync(codeListTestId: string): Promise<TestInfo> {
    const existsInCache: TestInfo = this.getTestInfoFromCache(
      Number(codeListTestId)
    );
    if (existsInCache) {
      return existsInCache;
    } else {
      return await this.getTestInfoFromCodeListAsync(codeListTestId);
    }
  }

  public async getTestInfoFromCodeListAsync(testid: string): Promise<TestInfo> {
    const url = unApi.codelistManagement.tests.replace(
      '{codeListTestId}',
      testid
    );
    await this.get<TestInfo>(url)
      .toPromise()
      .then(data => {
        this._testInfoCache.push(data);
      });
    return this.getTestInfoFromCache(Number(testid));
  }

  public async getUserActionsAsync(): Promise<Array<UserAction>> {
    const url = unApi.dataManagement.actions;
    return await this.get<Array<UserAction>>(url).toPromise();
  }

  private getTestSpecInfoFromCache(testSpecId: number): TestSpecInfo {
    return this._testSpecInfoCache.find(x => x.id === testSpecId);
  }

  private getTestInfoFromCache(testId: number): TestInfo {
    return this._testInfoCache.find(x => x.id === testId);
  }

  public async postTestSpecAsync(testSpec: TestSpec): Promise<TestSpec> {
    const url = unApi.codelistManagement.testSpecAdd;
    return await this.post<TestSpec>(url, testSpec, true).toPromise();
  }

  public async postTestSpecsInBatchAsync(testSpecs: TestSpec[]): Promise<TestSpec[]> {
    const url = unApi.codelistManagement.testSpecAddBatch;
    return await this.post<TestSpec[]>(url, testSpecs, true).toPromise();
  }

  public getManufacturers(manufacturerType: string, locationId: string): Observable<Array<Manufacturer>> {
    const url = unApi.codelistManagement.manufacturer
    .replace(urlPlaceholders.manufacturerType, manufacturerType).replace(urlPlaceholders.locationId, locationId);
    return this.get<Array<Manufacturer>>(url);
  }

  public getInstruments(manufacturerId: string): Observable<LabInstrumentListPoint[]> {
    const url = unApi.codelistManagement.instrumentsList.replace('{manufacturerId}', manufacturerId.toString());
    return this.get<LabInstrumentListPoint[]>(url);
  }

  public getUnits(productMasterLotId: number, analyteId: number, instrumentId: number): Observable<Unit[]> {
    // tslint:disable-next-line: max-line-length
    const url = `${unApi.codelistManagement.units}?${params.productLot}=${productMasterLotId}&${params.analyte}=${analyteId}&${params.instrument}=${instrumentId}`;
    return this.get<Unit[]>(url);
  }

  public getReagents(productMasterLotId: number, analyteId: number, instrumentId: number): Observable<Reagent[]> {
    // tslint:disable-next-line: max-line-length
    const url = `${unApi.codelistManagement.reagent}?${params.productLot}=${productMasterLotId}&${params.analyte}=${analyteId}&${params.instrument}=${instrumentId}`;
    return this.get<Reagent[]>(url);
  }

  public getAnalytes(productMasterLotId: number, instrumentId: number): Observable<Analyte[]> {
    const url = `${unApi.codelistManagement.analyte}?${params.productLot}=${productMasterLotId}&${params.instrument}=${instrumentId}`;
    return this.get<Analyte[]>(url);
  }

  public getMethods(analyteId: number, instrumentId: number, reagentId: number): Observable<Method[]> {
    // tslint:disable-next-line: max-line-length
    const url = `${unApi.codelistManagement.method}?${params.instrument}=${instrumentId}&${params.analyte}=${analyteId}&${params.reagent}=${reagentId}`;
    return this.get<Method[]>(url);
  }

  public getCalibrators(analyteId: number, instrumentId: number, reagentId?: number): Observable<Calibrator[]> {
    // tslint:disable-next-line: max-line-length
    let url = `${unApi.codelistManagement.calibrator}?${params.instrument}=${instrumentId}&${params.analyte}=${analyteId}`;

    if (reagentId) {
      url = url + `&${params.reagent}=${reagentId}`;
    }

    return this.get<Calibrator[]>(url);
  }

  // Temporary method to ensure codelist ids are strings. This allows matching with node codelist ids (InstrumentId, ProductId, etc.)
  private getListWithStringIds(listWithNumericIds: any[]) {
    listWithNumericIds.forEach(item => {
      item['id'] = item['id'] + '';
    });
    return listWithNumericIds;
  }

  public getTestSpecsByIds(testSpecsByIds: number[]): Observable<TestSpecsByIds> {
    const url = unApi.codelistManagement.testSpecsByIds;
    return this.post<TestSpecsByIds>(url, testSpecsByIds, true);
  }

  public async getMatrixDefinitionsAsync(): Promise<Matrix[]> {
    if (this._matrixCache.length === 0) {
      const url = unApi.matrix.matrixData;
      await this.get<Matrix[]>(url)
        .toPromise()
        .then(data => {
          this._matrixCache = data;
        });
    }
    return this._matrixCache;
  }
  public getNonBrControlDefinitions(accountId: string, showAsBusy?: boolean): Observable<CustomControl[]> {
    const url = unApi.codelistManagement.customProductsByAccountId.replace(urlPlaceholders.accountId, accountId);
    return this.get<CustomControl[]>(url, null, showAsBusy);
  }

  public putNonBrControlDefinition(product: CustomControl): Observable<CustomControl> {
    const url = unApi.codelistManagement.customProducts;
    return this.put(url, product);
  }

  public postAddNewNonBRLot(lot: CustomControlMasterLot): Observable<CustomControlMasterLot> {
    const url = unApi.codelistManagement.customProductLots;
    return this.post(url, lot);
  }

  public putNonBRLot(lot: CustomControlMasterLot): Observable<CustomControlMasterLot> {
    const url = unApi.codelistManagement.customProductLots;
    return this.put<CustomControlMasterLot>(url, lot);
  }

}
