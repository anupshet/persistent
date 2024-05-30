import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { WebsocketService } from './websocket.service';
import { TopicTrackerService } from './topic-tracker.service';
import { AuthenticationService } from '../../../security/services';
import { CoreModule } from '../../core.module';
import { ConfigService } from '../../config/config.service';
import { MessageQueueService } from './message-queue.service';

describe('WebsocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, CoreModule],
    providers: [
      { provide: ConfigService, useValue: {} },
      { provide: AuthenticationService, useValue: {} },
      { provide: TopicTrackerService },
      { provide: MessageQueueService }
    ]
  }).compileComponents());

  it('should be created', () => {
    const service: WebsocketService = TestBed.get(WebsocketService);
    expect(service).toBeTruthy();
  });
});
