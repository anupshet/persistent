import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { first } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AppConfig } from '../config/config.contract';
import { AppLoggerService } from '../../shared/services/applogger/applogger.service'; // TO DO: Remove after code review
import { localhostName } from './constants/general.const';

@Injectable()
export class ConfigService {
  private config: AppConfig;

  constructor(private http: HttpClient, private appLoggerService: AppLoggerService) { }

  public getConfig(key: any) {
    const config = this.config;


    // TODO : Remove force config loading on 'null', after state mgmt. is fully migrated to NGRX

    if (!config || config[key] === null || config[key] === undefined) {
      this.appLoggerService.error('Config value null for: ', key); // TO DO: Remove after code review
      return null;
    }
    return config[key];
  }

  public load(): Promise<any> {
    // Redirect to secure protocol.
    if (location.protocol !== 'https:' && location.hostname.toLocaleLowerCase() !== localhostName && location.hostname !== '127.0.0.1') {
      location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }

    // Load configuration.
    return new Promise((resolve, reject) => {
      if (environment.remoteBackend) {
        this.appLoggerService.log('Loading env-specific.json');

        this.http
          .get<AppConfig>('./assets/environment-config.json').pipe(
            first())
          .subscribe(remoteEnv => {
            this.config = Object.assign(environment, remoteEnv);
            resolve(true);
          });
      } else {
        // Local Dev Environment
        this.appLoggerService.log('Loading local dev environment configuration.');
        this.config = environment;
        resolve(true);
      }
    });
  }
}
