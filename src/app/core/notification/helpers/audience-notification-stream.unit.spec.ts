import { AudienceNotificationStream } from './audience-notification-stream';
import { AudienceType } from '../interfaces/audience-type';
import { NotificationSubject } from '../interfaces/notification-subject';
import { UnityNotification } from '../interfaces/unity-notification';

describe('AudienceNotificationStream', () => {
  let sut: AudienceNotificationStream;

  beforeEach(() => {
    sut = new AudienceNotificationStream();
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  describe('GetNotificationSubject', () => {
    it('should throw exception with Audience Type that is not exist', () => {
      const result = () => sut.GetNotificationSubject(AudienceType.User);
      expect(result).toThrow();
    });

    it('should return NotificationSubject if the Audience Type is exist', () => {
      const audienceType = AudienceType.User;

      sut.AddOrUpdateAudience(audienceType);
      const result = sut.GetNotificationSubject(audienceType);

      expect(result).toBeTruthy();
      expect(result.audienceType).toBe(audienceType);
    });

    it('default audience name should be empty', () => {
      const audienceType = AudienceType.User;

      sut.AddOrUpdateAudience(audienceType);
      const result = sut.GetNotificationSubject(audienceType);

      expect(result).toBeTruthy();
      expect(result.audienceName).toBe('');
    });
  });

  describe('AddOrUpdateAudience', () => {
    it('should add audience with specific name and type', () => {
      const audienceType = AudienceType.User;
      const audienceName = 'userID234';

      sut.AddOrUpdateAudience(audienceType, audienceName);
      const result = sut.GetNotificationSubject(audienceType);

      expect(result).toBeTruthy();
      expect(result.audienceName).toBe(audienceName);
      expect(result.audienceType).toBe(audienceType);
    });

    it('should update notification subject with new audience name when audienceType is exist', () => {
      const audienceType = AudienceType.User;
      const audienceName = 'userID234';
      sut.AddOrUpdateAudience(audienceType, audienceName);
      const result = sut.GetNotificationSubject(audienceType);

      const newAudienceName = '__userID234879';
      sut.AddOrUpdateAudience(audienceType, newAudienceName);
      const newResult = sut.GetNotificationSubject(audienceType);

      expect(newResult).toBe(result);
      expect(newResult.audienceName).toBe(newAudienceName);
    });
  });

  describe('Next', () => {
    let sutNotificationSubject: NotificationSubject;
    const audienceType = AudienceType.User;
    beforeEach(() => {
      sut.AddOrUpdateAudience(audienceType);
      sutNotificationSubject = sut.GetNotificationSubject(audienceType);

      spyOn(sutNotificationSubject.subject, 'next').and.callThrough();
      spyOn(console, 'warn').and.callThrough();
    });

    it('console warning should be called if notification is null', () => {
      sut.Next(null);
      expect(console.warn).toHaveBeenCalled();
    });

    it('console warning should be called if notification does have audience type', () => {
      sut.Next({} as UnityNotification);
      expect(console.warn).toHaveBeenCalled();
    });

    it('subject next should be called with a valid notification', () => {
      sut.Next({ audienceType: audienceType} as UnityNotification);
      expect(sutNotificationSubject.subject.next).toHaveBeenCalled();
    });
  });
});


