import { PezType } from '../../enums/pez-type.enum';

export class Pez {
  contents: PezContent[];
  pezType: PezType;
  actionTitle?: string;
  commentTitle?: string;
  actionLogsTitle?: string;
  atText?: string;
}

export class PezContent {
  userName: string;
  text: string;
  dateTime: Date;
  pezDateTimeOffset: string;
  labelHeader?: string;
  labelAt?: string;
}
