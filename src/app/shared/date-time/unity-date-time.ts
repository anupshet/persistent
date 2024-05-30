import * as moment from 'moment';
import 'moment-timezone';

export interface UnityDateTimeFormatted {
    tz: string;
    tzDateTime: UnityDateTime;
    utcDateTime: UnityDateTime;
}

export class UnityDateTime {
    DateObj: Date;
    DateTimeNoFormat: string;
    DateTimeFormatted: string;
    DateFormatted: string;
    TimeFormatted: string;

    static Build(momentObj: moment.Moment, dateFormat = '', timeFormat = ''): UnityDateTime {
        const fullFormat = `${dateFormat} ${timeFormat}`;
        const tzDateObj = momentObj.toDate();
        const tzNoFormat = momentObj.format();
        const tzFormatted = momentObj.format(fullFormat);
        const tzDateFormatted = momentObj.format(dateFormat);
        const tzTimeFormatted = momentObj.format(timeFormat);

        return {
            DateObj: tzDateObj,
            DateTimeNoFormat: tzNoFormat,
            DateTimeFormatted: tzFormatted,
            DateFormatted: tzDateFormatted,
            TimeFormatted: tzTimeFormatted
        } as UnityDateTime;
    }
}
