import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsocketMessage } from '../interfaces/websocket-message.interface';

enum QueueAction {
  enqueue = 1,
  dequeue = 2
}

class MessageAction {
  topicName: string;
  message: WebsocketMessage;
  queueAction: QueueAction;
}

@Injectable({
  providedIn: 'root'
})

export class MessageQueueService {

  private messageQueue: WebsocketMessage[] = [];
  private $messageQueueAction = new Subject<MessageAction>();
  private serviceName = 'Message Queue Service';

  constructor() {
    this.$messageQueueAction.subscribe((messageAction: MessageAction) => {
      switch (messageAction.queueAction) {
        case QueueAction.enqueue:
          this.messageQueue.push(messageAction.message);
          break;
        case QueueAction.dequeue:
          this.processDequeue(messageAction.topicName);
          break;
        default:
          console.error(this.serviceName + ' - Unknown Message Action Type');
          break;
      }
    });
   }

  private processDequeue(topicName: string) {
    if (this.messageQueue.length > 0) {
      this.messageQueue = this.messageQueue.filter(message => message.topic !== topicName);
    }
  }

  getMessages(topicName: string): WebsocketMessage[] {
    return this.messageQueue.filter(message => message.topic === topicName);
  }

  enqueueMessage(message: WebsocketMessage): void {
    const messageAction: MessageAction = {
      topicName: message.topic,
      message: message,
      queueAction: QueueAction.enqueue
    };
    this.$messageQueueAction.next(messageAction);
  }

  dequeueMessage(topicName: string): void {
    const messageAction: MessageAction = {
      topicName: topicName,
      message: null,
      queueAction: QueueAction.dequeue
    };
    this.$messageQueueAction.next(messageAction);
  }

}
