import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { debounceTime, finalize, take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base.component';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from '../../../../shared/interfaces/app-user.interface';
import { ThemeService } from '../../../../core/services/theme.service';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent extends BaseComponent implements OnInit {
  activeTabIndex = 0;

  itemUrlForm = this.fb.group({
    itemUrl: ['', [Validators.required]]
  });

  profileSettingsForm = this.fb.group({
    email: [false],
    messenger: [false],
    push: [false],
    darkTheme: [false]
  });

  constructor(
    public readonly auth: AuthService,
    private readonly notifications: TuiNotificationsService,
    private readonly fireMessaging: AngularFireMessaging,
    private readonly firestore: AngularFirestore,
    private readonly fb: FormBuilder,
    public readonly theme: ThemeService
  ) {
    super();
  }

  ngOnInit(): void {
    if (environment.production) {
      this.initCloudNotifications();
    }

    this.auth.user.pipe(
      take(1),
      takeUntil(this.destroyed)
    ).subscribe((user: AppUser) => {
      this.profileSettingsForm.patchValue(user.profileSettings, {emitEvent: false});
    });

    this.profileSettingsForm.valueChanges.pipe(
      debounceTime(1000),
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.onNotificationsSettingsFormSubmit();
    });
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
          const currentTokens = new Set(user.notificationTokens);
          currentTokens.add(token);
          this.auth.getUserRef(user.uid).update({notificationTokens: Array.from(currentTokens)});
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

  public onItemUrlForm(): void {
    this.isRequestPending = true;
    this.itemUrlForm.disable();

    this.auth.user.pipe(
      finalize(() => {
        this.isRequestPending = false;
        this.itemUrlForm.enable();
      }),
      take(1),
      takeUntil(this.destroyed)
    ).subscribe((user: AppUser) => {
      const currentTrackedUrls = new Set(user.trackedUrls);
      const {itemUrl} = this.itemUrlForm.value;

      if (!currentTrackedUrls.has(itemUrl)) {
        currentTrackedUrls.add(itemUrl);
        this.auth.getUserRef(user.uid).update({trackedUrls: Array.from(currentTrackedUrls)});
        this.itemUrlForm.reset();
        this.notifications.show('Przedmiot został dodany do obserwowanych', {
          status: TuiNotification.Success
        }).subscribe();
      } else {
        this.notifications.show('Przedmiot jest już obserwowanych', {
          status: TuiNotification.Warning
        }).subscribe();
      }
    });
  }

  public onItemUrlRemove(itemUrl: string): void {
    this.auth.user.pipe(
      take(1),
      takeUntil(this.destroyed)
    ).subscribe((user: AppUser) => {
      const currentTrackedUrls = new Set(user.trackedUrls);
      currentTrackedUrls.delete(itemUrl);
      this.auth.getUserRef(user.uid).update({trackedUrls: Array.from(currentTrackedUrls)});
      this.notifications.show('Przedmiot został usunięty z obserwowanych', {
        status: TuiNotification.Success
      }).subscribe();
    });
  }

  public onNotificationsSettingsFormSubmit(): void {
    this.auth.user.pipe(
      take(1),
      takeUntil(this.destroyed)
    ).subscribe((user: AppUser) => {
      this.auth.getUserRef(user.uid).update({profileSettings: this.profileSettingsForm.value});
      this.notifications.show('Ustawienia powiadomień zostały zapisane', {
        status: TuiNotification.Success
      }).subscribe();
    });
  }
}
