import { TestBed } from '@angular/core/testing';

import { MessageQueueService } from './message-queue.service';

describe('MessageQueueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageQueueService = TestBed.get(MessageQueueService);
    expect(service).toBeTruthy();
  });
});
