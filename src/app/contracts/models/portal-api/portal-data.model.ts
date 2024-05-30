// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { UserMessage } from '../user-preference/user-message.model';
import { EntityType } from '../../enums/entity-type.enum';
import { FeatureInfo } from './feature-info.model';
import { LabProduct } from '../lab-setup';

export abstract class BasePortalDataEntity {
  id: string;
  entityType: PortalDataDocumentType;
  searchAttribute?: string;
  featureInfo?: FeatureInfo;
  children?: LabProduct[];
}

export abstract class BasePortalRegionalDataEntity extends BasePortalDataEntity { }

export enum PortalDataDocumentType {
  Contact = 0,
  Address = 1,
  UserPreferences = 2,
  SPAConfig = 3
}

export class UserPreference extends BasePortalDataEntity {
  lastSelectedEntityId: string;
  lastSelectedEntityType: EntityType;
  termsAcceptedDateTime: Date;
  // TODO: work on userMessages when back-end is ready.
  userMessages: Array<UserMessage> = null;
}

export class SPAConfig extends BasePortalDataEntity {
  api: any = {};
  auth: any = {};
  additionalConfig: any = {};
}

export class Contact extends BasePortalRegionalDataEntity {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  middleName?: string;
}

export class Address extends BasePortalRegionalDataEntity {
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  streetAddress?: string;
  suite?: string;
  nickName?: string;
  streetAddress3?: string;
}
