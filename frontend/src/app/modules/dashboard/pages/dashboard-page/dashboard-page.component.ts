import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base.component';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AppUser } from '../../../../shared/interfaces/app-user.interface';
import { ThemeService } from '../../../../core/services/theme.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent extends BaseComponent implements OnInit {
  constructor(
    public readonly auth: AuthService,
    private readonly notifications: TuiNotificationsService,
    private readonly fireMessaging: AngularFireMessaging,
    private readonly firestore: AngularFirestore,
    public readonly theme: ThemeService
  ) {
    super();
  }

  ngOnInit(): void {
    if (environment.production) {
      this.initCloudNotifications();
    }
  }

  private initCloudNotifications(): void {
    this.fireMessaging.requestPermission.pipe(
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.fireMessaging.getToken.pipe(
        takeUntil(this.destroyed)
      ).subscribe((token: string) => {
        this.auth.user.pipe(
          take(1),
          takeUntil(this.destroyed)
        ).subscribe((user: AppUser) => {
          const userRef: AngularFirestoreDocument<AppUser> = this.firestore.doc(`users/${user.uid}`);
          const currentTokens = new Set(user.notificationTokens);
          currentTokens.add(token);
          userRef.update({notificationTokens: Array.from(currentTokens)});
        });
      });
    });

    this.fireMessaging.onMessage((payload: any) => {
      navigator.serviceWorker.getRegistration().then((registration: ServiceWorkerRegistration) => {
        const {title, body, icon} = payload.data;
        console.log(payload);
        registration.showNotification(title, payload.data);
        this.notifications.show(body, {
          label: title,
          status: TuiNotification.Success,
          autoClose: false
        }).subscribe();
      });
    });
  }
}
