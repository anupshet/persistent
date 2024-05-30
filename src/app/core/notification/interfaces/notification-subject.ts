import { Subject } from 'rxjs';
import { UnityNotification } from './unity-notification';
import { AudienceType } from './audience-type';


export class NotificationSubject {
    subject: Subject<UnityNotification>;
    constructor(
        public audienceType: AudienceType,
        public audienceName: string) {
        this.subject  = new Subject<UnityNotification>();
    }
}



