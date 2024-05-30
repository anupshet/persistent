// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { CustomControl } from '../control-management/custom-control.model'

export class CustomControlRequest {
  control: CustomControl;
  instruments: string[];
  customName: string;
}

export class CustomControlDeleteRequest {
  id: number;
  accountId: string;
  name: string
}
