import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../../shared/components/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { AppUser } from '../../../../../../shared/interfaces/app-user.interface';
import { AuthService } from '../../../../../../core/services/auth.service';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import * as isEqual from 'lodash.isequal';


@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent extends BaseComponent implements OnInit {
  hasUnsavedProfileSettingsForm = false;
  defaultProfileSettingsFormValue: any;
  profileSettingsForm = this.fb.group({
    email: [false],
    messenger: [false],
    push: [false],
    darkTheme: [false],
    notificationsEmail: [''],
    notificationsMessenger: ['']
  });

  hasUnsavedCheckFrequencyForm = false;
  defaultCheckFrequencyFormValue: any;
  checkFrequencyForm = this.fb.group({
    checkFrequency: [null, [Validators.required, Validators.min(30)]]
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
      this.profileSettingsForm.patchValue(user.profileSettings, {emitEvent: false});
      this.defaultProfileSettingsFormValue = this.profileSettingsForm.value;
    });

    this.checkFrequencyForm.patchValue({
      checkFrequency: Number(localStorage.getItem('checkFrequency')) ?? 30
    }, {emitEvent: false});
    this.defaultCheckFrequencyFormValue = this.checkFrequencyForm.value;

    this.profileSettingsForm.valueChanges.pipe(
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.hasUnsavedProfileSettingsForm = !isEqual(this.profileSettingsForm.value, this.defaultProfileSettingsFormValue);
    });

    this.checkFrequencyForm.valueChanges.pipe(
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.hasUnsavedCheckFrequencyForm = !isEqual(this.checkFrequencyForm.value, this.defaultCheckFrequencyFormValue);
    });
  }

  public onNotificationsSettingsFormSubmit(): void {
    this.auth.user.pipe(
      take(1),
      takeUntil(this.destroyed)
    ).subscribe((user: AppUser) => {
      this.auth.getUserRef(user.uid).update({profileSettings: this.profileSettingsForm.value});
      this.defaultProfileSettingsFormValue = this.profileSettingsForm.value;
      this.hasUnsavedProfileSettingsForm = false;
      this.notifications.show('Ustawienia powiadomień zostały zapisane', {
        status: TuiNotification.Success
      }).subscribe();
    });
  }

  public onCheckFrequencyFormSubmit(): void {
    localStorage.setItem('checkFrequency', this.checkFrequencyForm.get('checkFrequency').value);
    this.defaultCheckFrequencyFormValue = this.checkFrequencyForm.value;
    this.hasUnsavedCheckFrequencyForm = false;
    this.notifications.show('Ustawienia częstotliwości sprawdzania zostały zapisane', {
      status: TuiNotification.Success
    }).subscribe();
  }
}
