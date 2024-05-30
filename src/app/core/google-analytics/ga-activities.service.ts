import { Injectable } from '@angular/core';
import { AppUser } from '../../security/model';
import { ConfigService } from '../config/config.service';
import { GoogleAnalyticsEvent } from './google-analytics-event';


@Injectable()
export class GaActivitiesService {
  private ga: (...any) => any;

  constructor(private config: ConfigService) {
    this.ga = (<any>window).ga;
  }

  pageView(url) {
    this.ga('set', 'page', url);
    this.ga('send', 'pageview');
  }

  create() {
    this.ga('create', this.config.getConfig('googleAnalyticsId'), 'auto');
  }

  user(user: AppUser) {
    const userId = `${user.userOktaId}`;
    this.ga('set', 'userId', userId);
  }

  event(event: GoogleAnalyticsEvent) {
    this.ga('send', 'event', {
      eventCategory: event.Category,
      eventLabel: event.Label,
      eventAction: event.Action,
      eventValue: 0
    });
  }
}
