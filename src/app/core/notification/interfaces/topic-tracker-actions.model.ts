export class TopicTrackerAction {
  topicName: string;
  topicAction: TopicTrackerActionType;
}

export enum TopicTrackerActionType {
  Subscribe = 1,
  Unsubscribe = 2
}
