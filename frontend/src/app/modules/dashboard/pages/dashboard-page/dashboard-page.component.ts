import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base.component';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from '../../../../shared/interfaces/app-user.interface';
import { ThemeService } from '../../../../core/services/theme.service';
import { FormBuilder, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { TrackedItem } from '../../../../shared/interfaces/tracked-item.interface';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent extends BaseComponent implements OnInit {
  activeTabIndex = 0;

  itemForm = this.fb.group({
    url: ['', [Validators.required]],
    name: ['', [Validators.required]]
  });

  profileSettingsForm = this.fb.group({
    email: [false],
    messenger: [false],
    push: [false],
    darkTheme: [false],
    notificationsEmail: [''],
    notificationsMessenger: ['']
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
      this.profileSettingsForm.patchValue(user.profileSettings);
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
    this.itemForm.disable();

    this.auth.user.pipe(
      finalize(() => {
        this.isRequestPending = false;
        this.itemForm.enable();
      }),
      take(1),
      takeUntil(this.destroyed)
    ).subscribe((user: AppUser) => {
      this.auth.getUserRef(user.uid).update({trackedItems: [...user.trackedItems, {...this.itemForm.value, id: uuidv4()}]});
      this.notifications.show(`Przedmiot: ${this.itemForm.get('name').value} został dodany do obserwowanych`, {
        status: TuiNotification.Success
      }).subscribe();
      this.itemForm.reset();
    });
  }

  public onItemUrlRemove(item: TrackedItem): void {
    this.auth.user.pipe(
      take(1),
      takeUntil(this.destroyed)
    ).subscribe((user: AppUser) => {
      this.auth.getUserRef(user.uid).update({
        trackedItems: user.trackedItems.filter(i => i.id !== item.id)
      });

      this.notifications.show(`Przedmiot: ${item.name} został usunięty z obserwowanych`, {
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
