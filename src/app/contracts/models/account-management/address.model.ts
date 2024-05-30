// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { PortalDataDocumentType } from '../portal-api/portal-data.model';

export class Address {
    id = '';
    streetAddress1 = '';
    streetAddress2 = '';
    streetAddress3 = '';
    city = '';
    state = '';
    zipCode = '';
    country = '';
    streetAddress = '';
    suite?: '';
    searchAttribute?: '';
    nickName?: '';
    // New For AWS Switch
    entityType = PortalDataDocumentType.Address;
}
