// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiConfig } from '../core/config/config.contract';
import { ConfigService } from '../core/config/config.service';
import { ApiService } from './api/api.service';
import { UserMessage } from '../contracts/models/user-preference/user-message.model';
import { PortalDataDocumentType, UserPreference, BasePortalDataEntity } from '../contracts/models/portal-api/portal-data.model';
import { EntityType } from '../contracts/enums/entity-type.enum';
import { PortalApiService } from './api/portalApi.service';
import { EN_US, FR_FR, ZH_HANS } from './locale/locale.constants';
import * as fromRoot from '../state/app.state';

@Injectable()
export class UserPreferenceService extends ApiService {

  public lastSelectedEntityId: string;
  public lastSelectedEntityType: EntityType;
  public entityType: PortalDataDocumentType;
  public termsAcceptedDateTime: Date;
  public userMessages: Array<UserMessage> = [
    // HardCoded until move to AWS and until need for more robust messaging service
    {
      message: 'You agree to the ',
      linkText: 'Terms of Service',
      linkUrl: 'https://qcnet.com/unitynexttermsofservice',
      requiresUserAction: true,
      updatedOn: new Date(2019, 3, 2),
      locale: EN_US
    },
    {
      message: 'You have read the ',
      linkText: 'Release Notes',
      linkUrl: 'https://qcnet.com/unitynextreleasenotes',
      requiresUserAction: true,
      updatedOn: new Date(1970, 1, 1),
      locale: EN_US
    },
    // TODO: Need to translate the following:
    {
      message: 'You agree to the ',
      linkText: 'Terms of Service',
      linkUrl: 'https://qcnet.com/unitynexttermsofservice',
      requiresUserAction: true,
      updatedOn: new Date(2019, 3, 2),
      locale: FR_FR
    },
    {
      message: 'You have read the ',
      linkText: 'Release Notes',
      linkUrl: 'https://qcnet.com/unitynextreleasenotes',
      requiresUserAction: true,
      updatedOn: new Date(1970, 1, 1),
      locale: FR_FR
    },
    {
      message: '你同意了 ',
      linkText: '服务条款', // terms of service
      linkUrl: 'https://qcnet.com/unitynexttermsofservice',
      requiresUserAction: true,
      updatedOn: new Date(2019, 3, 2),
      locale: ZH_HANS
    },
    {
      message: '你已经读过了 ',
      linkText: '发行说明',
      linkUrl: 'https://qcnet.com/unitynextreleasenotes',
      requiresUserAction: true,
      updatedOn: new Date(1970, 1, 1),
      locale: ZH_HANS
    }
  ];

  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    private portalApiService: PortalApiService
  ) {
    super(http, config, store);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).portalUrl;
  }

  // TODO Remove once we move userMessages to the backend (affects settings bar)
  returnUserMessages() {
    return this.userMessages;
  }

  updateUserPreferenceFromDB(userPreference: UserPreference): Observable<BasePortalDataEntity> {
    return this.portalApiService.upsertPortalData(userPreference);
  }

}
