/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Component, Inject } from '@angular/core';

import { InstanceConfigHolderService } from 'ng-busy';
import { CheckForTloaderService } from '../../services/check-for-tloader.service';

@Component({
  selector: 'unext-unity-busy',
  templateUrl: './unity-busy.component.html',
})

export class UnityBusyComponent {
  hideTLoader = false;
  constructor(@Inject('instanceConfigHolder') private instanceConfigHolder: InstanceConfigHolderService,
  private checkForTloaderService: CheckForTloaderService,  ) {
    }

    ngOnInit(){
      this.checkForTloaderService.tloaderSubject.subscribe(data => {
        this.hideTLoader = data;
    });
  }
}
