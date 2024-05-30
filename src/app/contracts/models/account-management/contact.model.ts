// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { PortalDataDocumentType } from "../portal-api/portal-data.model";

export class Contact {
    firstName: string;
    lastName: string;
    name: string;       // First and last name
    email: string;
    middleName?: string;
    entityType?:  PortalDataDocumentType;
    searchAttribute?: string;
    phone?: string;
    id?: string
}
