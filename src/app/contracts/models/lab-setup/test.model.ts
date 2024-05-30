// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { TreePill } from './tree-pill.model';
import { EntityType } from '../../enums/entity-type.enum';
import { TestSpec } from '../portal-api/labsetup-data.model';
import { LabProduct } from '../lab-setup';

export class LabTest extends TreePill {
    nodeType = EntityType.LabTest;
    testSpecId: string | number;
    labUnitId: string;
    testSpecInfo: TestSpec;
    testId: string;
    correlatedTestSpecId: string;
    displayName: string;
    parentNode?: LabProduct;
    mappedTestSpecs?: string;
    isArchived?: boolean;
    isLotExpired?: boolean;
    allTestSpecIds?: Array<string>;
    typeOfOperation?: boolean;
    isRemapRequired?: boolean;
}
