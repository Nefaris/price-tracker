import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { BaseComponent } from '../../../../shared/components/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { fromPromise } from 'rxjs/internal-compatibility';
import { finalize, takeUntil } from 'rxjs/operators';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent extends BaseComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private readonly auth: AuthService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly notifications: TuiNotificationsService
  ) {
    super();
  }

  onLoginFormSubmit(): void {
    const {email, password} = this.loginForm.value;

    this.isRequestPending = true;
    this.loginForm.disable();
    fromPromise(this.auth.signInWithEmail(email, password)).pipe(
      finalize(() => {
        this.isRequestPending = false;
        this.loginForm.enable();
      }),
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.router.navigate(['dashboard']);
    }, (error) => {
      let message = '';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = 'Wprowadzono niepoprawne dane logowania';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Za dużo prób logowania, dostęp do konta został tymczasowo zablokowany, spróbuj ponownie za jakiś czas';
      } else {
        message = 'Wystąpił błąd podczas próby logowania, spróbuj ponownie';
      }

      this.notifications.show(message, {
        status: TuiNotification.Error
      }).subscribe();
    });
  }
}
