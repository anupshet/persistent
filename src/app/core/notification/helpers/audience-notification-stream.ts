import { AudienceType } from '../interfaces/audience-type';
import { NotificationSubject } from '../interfaces/notification-subject';
import { UnityNotification } from '../interfaces/unity-notification';


export class AudienceNotificationStream {
    private _notificationSubjects: Map<AudienceType, NotificationSubject>;

    constructor() {
        this._notificationSubjects = new Map<AudienceType, NotificationSubject>();
    }

    AddOrUpdateAudience(audienceType: AudienceType, audienceName: string = '') {
        if (this._notificationSubjects[audienceType]) {
            if (audienceName) {
                const notificationSubject = this._notificationSubjects[audienceType] as NotificationSubject;
                notificationSubject.audienceName = audienceName;
            }
        } else {
            this._notificationSubjects[audienceType] = new NotificationSubject(audienceType, audienceName);
        }
    }

    GetNotificationSubject(audienceType: AudienceType): NotificationSubject {
        const notificationSubjects = this._notificationSubjects[audienceType];
        if (notificationSubjects) {
            return notificationSubjects;
        }
        throw new Error(`Audience Type '${audienceType}' has not been registered to notification service`);
    }

    Next(notification: UnityNotification) {
        if (notification && notification.audienceType) {
            const notificationSubject = this.GetNotificationSubject(notification.audienceType);
            if (notificationSubject) {
              notificationSubject.subject.next(notification);
            } else {
              console.warn('Audience Notification Subsject not found');
            }
        } else {
            console.warn('Received notification is not well formatted. It has to have audience type. e.g Lab, User', notification);
        }
    }
}


