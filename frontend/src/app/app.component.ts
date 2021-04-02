import { Component, OnInit } from '@angular/core';
import 'firebase/messaging';
import { SwPush } from '@angular/service-worker';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { fromPromise } from 'rxjs/internal-compatibility';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from './shared/components/base.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  displayToken: string;

  constructor(
    private readonly notifications: TuiNotificationsService,
    private readonly fireMessaging: AngularFireMessaging,
    private readonly swPush: SwPush
  ) {
    super();
  }

  ngOnInit(): void {
    this.initCloudNotifications();
  }

  private initCloudNotifications(): void {
    fromPromise(navigator.serviceWorker.getRegistration()).pipe(
      takeUntil(this.destroyed)
    ).subscribe((swr: ServiceWorkerRegistration) => {
      fromPromise(this.fireMessaging.useServiceWorker(swr)).pipe(
        takeUntil(this.destroyed)
      ).subscribe(() => {
        this.fireMessaging.requestPermission.pipe(
          takeUntil(this.destroyed)
        ).subscribe(() => {
          this.fireMessaging.getToken.pipe(
            takeUntil(this.destroyed)
          ).subscribe((token: string) => {
            console.log('notifications token', token);
          });
        });

        this.swPush.messages.pipe(
          takeUntil(this.destroyed)
        ).subscribe(({notification}: any) => {
          this.notifications.show(notification.body, {
            label: notification.title,
            autoClose: false,
            status: TuiNotification.Success
          }).subscribe();
        });
      });
    });
  }
}
