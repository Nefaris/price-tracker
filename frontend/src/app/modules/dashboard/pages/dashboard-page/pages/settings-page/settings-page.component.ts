import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../../shared/components/base.component';
import { FormBuilder } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { AppUser } from '../../../../../../shared/interfaces/app-user.interface';
import { AuthService } from '../../../../../../core/services/auth.service';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';


@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent extends BaseComponent implements OnInit {
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
    private readonly fb: FormBuilder,
    private readonly notifications: TuiNotificationsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.auth.user.pipe(
      take(1),
      takeUntil(this.destroyed)
    ).subscribe((user: AppUser) => {
      this.profileSettingsForm.patchValue(user.profileSettings);
    });
  }

  public onNotificationsSettingsFormSubmit(): void {
    this.auth.user.pipe(
      take(1),
      takeUntil(this.destroyed)
    ).subscribe((user: AppUser) => {
      this.auth.getUserRef(user.uid).update({profileSettings: this.profileSettingsForm.value});
      this.notifications.show('Ustawienia profilu zostały zapisane', {
        status: TuiNotification.Success
      }).subscribe();
    });
  }
}
