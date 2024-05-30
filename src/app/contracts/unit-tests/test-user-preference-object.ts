// import { UserPreferenceEntity } from '../models/user-preference/user-preference-entity.model';
import { EntityType } from '../enums/entity-type.enum';
import { UserPreference, PortalDataDocumentType } from '../models/portal-api/portal-data.model';

export class TestUserPreferenceObject {
  static userPreferenceEntity: UserPreference = {
    id: '123',
    entityType: PortalDataDocumentType.UserPreferences,
    lastSelectedEntityId: '123YQW',
    lastSelectedEntityType: EntityType.LabProduct,
    termsAcceptedDateTime: new Date(0),
    userMessages: [],
    searchAttribute: '123',
    featureInfo:{
      uniqueServiceName:"Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences"
   }
  };
}
