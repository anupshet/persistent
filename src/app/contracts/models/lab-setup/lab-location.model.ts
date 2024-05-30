// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Department } from './department.model';
import { LabInstrument } from './instrument.model';
import { TreePill } from './tree-pill.model';
import { EntityType } from '../../enums/entity-type.enum';
import { Contact, Address } from '../portal-api/portal-data.model';
import { Lab } from '../lab-setup/lab.model';
import { ConnectivityTier, UnityNextTier } from '../../enums/lab-location.enum';
import { AccountSettings } from './account-settings.model';
import { Transformer } from '../../../contracts/models/account-management/transformers.model';
import { AddOnsFlags } from './lab-location-addons.model';

export class LabLocation extends TreePill {
  children: Department[] | LabInstrument[]; // LabLocation may have departments or instruments as children
  locationTimeZone: string;
  locationOffset: string;
  locationDayLightSaving: string;
  nodeType = EntityType.LabLocation;
  labLocationName: string;
  labLocationContactId: string;
  labLocationContact: Contact;
  labLocationAddressId: string;
  labLocationAddress: Address;
  parentNode?: Lab;
  orderNumber?: string;
  unityNextTier?: UnityNextTier;
  unityNextInstalledProduct?: string;
  contactRoles?: Array<string>;
  connectivityTier?: ConnectivityTier;
  connectivityInstalledProduct?: string;
  lotViewerLicense?: number;
  lotViewerInstalledProduct?: string;
  addOns?: number;
  addOnsFlags?: AddOnsFlags;
  crossOverStudy?: number;
  licenseAssignDate?: string | Date;
  licenseExpirationDate?: string | Date;
  licenseNumberUsers?: number;
  shipTo?: string;
  soldTo?: string;
  primaryUnityLabNumbers?: string;
  hasChildren?: boolean;
  locationCount?: number;
  accountName?: string;
  accountNumber?: string;
  groupName?: string;
  transformers?: Array<Transformer>;
  comments?: string;
  formattedAccountNumber?: string;
  locationSettings?: AccountSettings;
  usedArchive?: boolean;
  islabsettingcompleted?: boolean;
  migrationStatus?: string;
  previousContactUserId: string;    // After an update, if the previous contact of the location was changed and is no longer referenced by account, location, or dept, this will contain the user id.
  labLanguagePreference?: string;
}
