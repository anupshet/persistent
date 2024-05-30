// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from '../../../security/services';
import { ConfigService } from '../../config/config.service';
import { CoreModule } from '../../core.module';
import { MqttService } from './mqtt.service';

describe('MqttService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, CoreModule],
    providers: [
      { provide: ConfigService, useValue: {} },
      { provide: AuthenticationService, useValue: {} },
    ]
  }).compileComponents());

  it('should be created', () => {
    const service: MqttService = TestBed.get(MqttService);
    expect(service).toBeTruthy();
  });
});
