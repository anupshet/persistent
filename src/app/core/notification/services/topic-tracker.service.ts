import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppLoggerService } from '../../../shared/services/applogger/applogger.service';
import { TopicTrackerAction, TopicTrackerActionType } from '../interfaces/topic-tracker-actions.model';

@Injectable({
  providedIn: 'root'
})
export class TopicTrackerService {
  trackedTopics: string[] = [];

  private serviceName = 'Topic Tracker Service';
  private $topicAction: Subject<TopicTrackerAction> = new Subject<TopicTrackerAction>();

  constructor(private appLoggerService: AppLoggerService) {
    this.$topicAction.subscribe(action => {
      this.processTopicTrackerAction(action);
      this.appLoggerService.log(this.serviceName + '- Service Initialized');
    });
  }

  processTopicTrackerAction(action: TopicTrackerAction) {
    switch (action.topicAction) {
      case TopicTrackerActionType.Subscribe:
        this.addTopicAction(action.topicName);
        break;
      case TopicTrackerActionType.Unsubscribe:
        this.removeTopicAction(action.topicName);
        break;
      default:
        this.appLoggerService.error(this.serviceName + '- Unknow Topic Tracker Action');
        break;
    }
  }

  addTopic(topicName: string) {
    const subscribeAction: TopicTrackerAction = {
      topicAction: TopicTrackerActionType.Subscribe,
      topicName: topicName
    };
    this.$topicAction.next(subscribeAction);
  }

  isTopicTracked(topicName: string): boolean {
    return this.trackedTopics.indexOf(topicName) > -1;
  }

  removeTopic(topicName: string) {
    const unsubscribeAction: TopicTrackerAction = {
      topicAction: TopicTrackerActionType.Unsubscribe,
      topicName: topicName
    };
    this.$topicAction.next(unsubscribeAction);
  }

  clearTopics() {
    this.trackedTopics = [];
  }

  private addTopicAction(topicName: string) {
    if (this.trackedTopics.indexOf(topicName) === -1) {
      this.trackedTopics.push(topicName);
      this.appLoggerService.log(this.serviceName + ' - Tracking Topic:', topicName);
    }
  }

  private removeTopicAction(topicName: string) {
    const topicIndex = this.trackedTopics.indexOf(topicName);
    if (topicIndex !== -1) {
      this.trackedTopics.splice(topicIndex, 1);
      this.appLoggerService.log(this.serviceName + ' - Stopped Tracking Topic:', topicName);
    }
  }
}
