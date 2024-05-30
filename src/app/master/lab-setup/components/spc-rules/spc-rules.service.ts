// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { filter, mergeMap, take } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { ApiConfig } from '../../../../core/config/config.contract';
import { ConfigService } from '../../../../core/config/config.service';
import { ApiService } from '../../../../shared/api/api.service';
import * as fromLabSetup from '../../state';
import * as fromRoot from '../../../../state/app.state';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { Rule } from '../../../../contracts/models/portal-api/level-test-settings.model';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { unApi } from '../../../../core/config/constants/un-api-methods.const';
import { urlPlaceholders } from '../../../../core/config/constants/un-url-placeholder.const';
import { ILabSettingsAPIService } from '../../../../contracts/interfaces/i-lab-settings-api.service';
import * as constants from '../../../../core/config/constants/general.const';
import { QueryParameter } from '../../../../shared//models/query-parameter';
import { includeArchivedItems, nodeTypeNames } from '../../../../core/config/constants/general.const';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';

@Injectable()
export class SpcRulesService extends ApiService implements ILabSettingsAPIService {
  public navigationCurrentlySelectedNode$ = this.labSetupStore.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  public navigationCurrentlySelectedLeaf$ = this.labSetupStore.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf));
  public getCurrentLabLocation$ = this.labSetupStore.pipe(select(sharedStateSelector.getCurrentLabLocation));
  private resetRules = new BehaviorSubject<any>(false);
  private formValues = null;

  constructor(
    http: HttpClient,
    config: ConfigService,
    spinnerService: SpinnerService,
    store: Store<fromRoot.State>,
    private labSetupStore: Store<fromLabSetup.LabSetupStates>,
    private portalApiService: PortalApiService,
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (config.getConfig('api')) ? (<ApiConfig>config.getConfig('api')).settingsUrl : '';
    this.resetRules.next(false);
  }

  public getLocationId() {
    let locationId: string;
    this.getCurrentLabLocation$.pipe(filter(labLocation => !!labLocation),
      take(1)).subscribe(labLocation => {
        if (labLocation) {
          locationId = labLocation.id;
        }
      });

    return locationId;
  }

  public setResetRules(arg): void {
    this.resetRules.next(arg);
  }

  public getResetRules(): Observable<any> {
    return this.resetRules.asObservable();
  }

  public setFormData(arg): void {
    this.formValues = arg;
  }

  public getFormData(): Array<Rule> {
    return this.sortRules(this.formValues);
  }

  public sortRules(rules: Array<Rule>): Array<Rule> {
    if (rules && rules.length) {
      rules.sort((r1, r2) => +r1.id - +r2.id);
    }

    return rules;
  }

  public updateSettings(nodeType: EntityType, settings: Settings): Observable<Settings> {
    // Send locationId in settingsV2 api payload for archive lot notifications
    const locationId = this.getLocationId();
    settings = { ...settings };
    settings.locationId = locationId;
    return this.putSettingsData(nodeTypeNames[nodeType], constants.settings, settings, true);
  }

  public postSettings(nodeType: EntityType, settings: Settings): Observable<Settings> {
    return this.postSettingsData(nodeTypeNames[nodeType], constants.settings, settings, true);
  }

  public createSettings(nodeType: EntityType, settings: Settings): Observable<any> {
    const queryParameter = new QueryParameter(includeArchivedItems, (false).toString());
    // Moving the first item in array to the last position bc last post call must return
    settings.entityIds.push(settings.entityIds.shift());

    const settingsModified = (entityId, res) => {
      const productLots = res['productLotLevels'];
      const settingsClone = cloneDeep(settings);
      for (let i = 0; i < productLots.length; i++) {
        const key = 'level' + productLots[i].level + 'Used';
        settingsClone.levelSettings[key] = true;
      }
      settingsClone.entityIds = [entityId.toString()];
      return settingsClone;
    };

    const setMultipleControlsIndividually = (entityId): void => {
      this.portalApiService.getLabSetupNode(nodeType, entityId, LevelLoadRequest.LoadChildren, EntityType.None, [queryParameter])
        .pipe().subscribe((res) => {
          this.post(`${constants.settings}/${nodeTypeNames[nodeType]}`, settingsModified(entityId, res), false).pipe().subscribe(() => {
            this.put(constants.settings, settingsModified(entityId, res), false); // this triggers settings call!?
          });
        });
    };

    for (let i = 0; i < settings.entityIds.length; i++) {
      if (i + 1 !== settings.entityIds.length) {
        setMultipleControlsIndividually(settings.entityIds[i]);
      } else {
        // Last item in array
        return from(
          this.portalApiService.getLabSetupNode(nodeType, settings.entityIds[i],
            LevelLoadRequest.LoadChildren, EntityType.None, [queryParameter])
            .pipe(mergeMap(res => {
              return this.postSettingsData(nodeTypeNames[nodeType], constants.settings, settingsModified(settings.entityIds[i], res), true);
            })));
      }
    }

  }

  public getSettings(nodeType: EntityType, entityId: string, parentEntityId: string): Observable<Settings> {
    const path = unApi.spcRules.settings
      .replace(urlPlaceholders.entityId, entityId).replace(urlPlaceholders.parentEntityId, parentEntityId)
      .replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.get(`${path}`, null, true);
  }
}
