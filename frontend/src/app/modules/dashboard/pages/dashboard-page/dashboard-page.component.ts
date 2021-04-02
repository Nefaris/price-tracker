import { Component, OnInit } from '@angular/core';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { SwPush } from '@angular/service-worker';
import { fromPromise } from 'rxjs/internal-compatibility';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base.component';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent extends BaseComponent implements OnInit {
  constructor(
    private readonly notifications: TuiNotificationsService,
    private readonly fireMessaging: AngularFireMessaging,
    private readonly swPush: SwPush
  ) {
    super();
  }

  ngOnInit(): void {
    if (environment.production) {
      this.initCloudNotifications();
    }
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
