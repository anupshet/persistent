/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Injectable } from '@angular/core';

import { TestSpec } from '../../contracts/models/portal-api/labsetup-data.model';
import { CodelistApiService } from '../api/codelistApi.service';
import { TestSpecsByIds } from 'src/app/shared/models/test-specs-by-ids.model';

@Injectable({
  providedIn: 'root'
})
export class TestSpecService {
  public testSpecCache: TestSpecsByIds;

  constructor(
    private codeListService: CodelistApiService
  ) { }

  public async getTestSpecs(testSpecIds: number[]): Promise<TestSpec[]>  {
    const keysNotInDictionary = this.testSpecCache ? testSpecIds.filter(key => !(key in this.testSpecCache)) : testSpecIds;
    if (keysNotInDictionary.length > 0) {
      this.testSpecCache = await this.getTestSpecsFromApi(keysNotInDictionary);
    }
    return testSpecIds.map(item => this.testSpecCache[item]);
  }

  private async getTestSpecsFromApi(testSpecIds: number[]): Promise<TestSpecsByIds> {
    let cache = this.testSpecCache;
    await this.codeListService.getTestSpecsByIds(testSpecIds).toPromise()
      .then((data: TestSpecsByIds) => {
        cache = this.testSpecCache ? { ...this.testSpecCache, ...data } : data;
      });
    return cache;
  }
}
