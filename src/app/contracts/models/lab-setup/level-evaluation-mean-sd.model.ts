import { EvaluationType } from '../../enums/lab-setup/evaluation-type.enum';

export class LevelEvaluationMeanSd {
  entityId: string;
  level: number;
  meanEvaluationType: EvaluationType;
  mean: number;
  sdEvaluationType: EvaluationType;
  sd: number;
  sdIsCalculated: boolean;
  cvEvaluationType: EvaluationType;
  cv: number;
  cvIsCalculated: boolean;
  isNew?: boolean;
}

export class LevelFloatingStatistics {
  entityId: string;
  level: number;
  mean: number;
  sd: number;
  cv: number;
}

export class LevelEvaluationMeanSdFormState {
  isFormValid?: boolean;
  isFormChanged?: boolean;
  level?: boolean;
  entityId?: string;
}
export class auditTrailmeanssd {
  account_id?: string;
  accountNumber?: string;
  accountName?: string;
  group_id?: string;
  groupName?: string;
  user_id?: string;
  location_id?: string;
  locationName?: string;
  userRoles?: string[];
  eventDateTime?: Date;
  localDateTime?: Date;
  awsCorrelationId?: string;
  auditTrail: {
    eventType: string;
    action: string;
    actionStatus: string
    priorValue?:
    {

    },
    currentValue:
    {

    }
  };
}

