import { Pipe } from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';


// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({ name: 'UnityDateTimeFormatter' })
export class UnityDateTimeFormatter {
    transform(value: Date, labTimeZone: string,  timeStamp: string): string {
      let date: any;
      date = moment(value);
      return  date.tz(labTimeZone).format('h:mm a');
    }
}

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({ name: 'unityDateTime' })
export class UnityDateTime {

  transform(value: Date, op: string, param: string): any {

      let labTimeZone: string;
      labTimeZone = param;
      // if redux === null labTimeZone = ''

      let data: any;
      const date: any = moment(value);

      // default input val
      data = value;

            // dafault
            if ( op !== undefined && op !== null) {
              if ( op.toLocaleLowerCase() !== '2utc' ) {
                if ( labTimeZone === undefined  || labTimeZone === '' ) {
                  return date;
                }
              }
            }

            // date is valid
            if (value !== undefined) {
                if (moment(value).isValid()) {
                  if (op === 'fromutc' && param !== undefined) {
                      if (  (labTimeZone !== null ) && (param !== '' && param !== null ) ) {
                        if ( moment.tz.zone(param) !== null) {
                              labTimeZone = param;
                              data =  date.tz(labTimeZone).format();
                              data = moment(data).format('MMM DD, YYYY');

                              // convert to other timeZone than the Redux Defualt
                            }  else {
                              data = value;
                            }
                      } else {
                        data = value;
                      }

                  } else if (op === '2utc' ) {
                        data = moment.parseZone(date).utc().format();
                  } else {
                        data = value;
                  }
                }
            }

            return data;
  }

}
