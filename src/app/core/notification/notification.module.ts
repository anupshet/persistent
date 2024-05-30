import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationManagerComponent } from './manager/notification-manager.component';
import { NotificationService } from './services/notification.service';
import { NotificationManagerService } from './services/notification-manager.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    NotificationManagerComponent
  ],
  declarations: [NotificationManagerComponent],
  providers: [NotificationManagerService, NotificationService]

})
export class NotificationModule { }
