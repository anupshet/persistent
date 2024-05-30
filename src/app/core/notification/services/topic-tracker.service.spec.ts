import { TestBed } from '@angular/core/testing';

import { TopicTrackerService } from './topic-tracker.service';
import { AppLoggerService } from '../../../shared/services/applogger/applogger.service';

describe('TopicTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AppLoggerService]
  }).compileComponents());

  it('should be created', () => {
    const service: TopicTrackerService = TestBed.get(TopicTrackerService);
    expect(service).toBeTruthy();
  });
});
