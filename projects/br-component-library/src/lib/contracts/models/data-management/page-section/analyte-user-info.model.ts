export abstract class UserInfo {
  userId: string;
  userFullName: string;
  enterDateTime: Date;
}

export class Action extends UserInfo {
  actionId: number;
  actionName: string;
}

export class UserComment extends UserInfo {
  content: string;
}

export class UserInteraction extends UserInfo {
  interactionType: InteractionType;
  content?: string;
}

export enum InteractionType {
  Added,
  Reviewed,
  Approved
}
