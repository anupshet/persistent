// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {
  Action,
  UserComment,
  UserInteraction
} from 'br-component-library/lib/contracts/models/data-management/page-section/analyte-user-info.model';
import { PezContent } from 'br-component-library/public_api';

export class PezCell {
  actions: Action[];
  comments: UserComment[];
  interactions: UserInteraction[] | PezContent[];
}
