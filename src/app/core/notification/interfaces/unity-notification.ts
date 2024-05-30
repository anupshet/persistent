import { NotificationType } from './unity-notification-type';
import { AudienceType } from './audience-type';
import { EntityType } from '../../../contracts/enums/entity-type.enum';

export interface UnityNotification {
    correlationId: string;
    audienceType: AudienceType;
    audienceKey: string;
    notificationType: NotificationType;
    payload: any;
    timeUtc: Date;
}

export class LotDuplicationStatus {
    id: string;
    nodeType: EntityType;
    userId: string;
    parentNodeId: string;
    instrumentName: string;
    productLotNumber: string;
    dateTime: Date;
    isSuccess: boolean;
}
