import { Lot } from './i-lot.model';

export class ReagentLot extends Lot {
    reagentId: number;
    reagentName?: string;
    reagentCategory: ReagentCategory;
 }

export declare const enum ReagentCategory {
  Generic = 1,
  Microslide = 2
}
