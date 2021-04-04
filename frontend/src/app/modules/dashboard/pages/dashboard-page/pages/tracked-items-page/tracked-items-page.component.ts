import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TrackedItem } from '../../../../../../shared/interfaces/tracked-item.interface';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { AppUser } from '../../../../../../shared/interfaces/app-user.interface';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { AuthService } from '../../../../../../core/services/auth.service';
import { BaseComponent } from '../../../../../../shared/components/base.component';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-tracked-items-page',
  templateUrl: './tracked-items-page.component.html',
  styleUrls: ['./tracked-items-page.component.scss']
})
export class TrackedItemsPageComponent extends BaseComponent {
  itemForm = this.fb.group({
    url: ['', [Validators.required]],
    name: ['', [Validators.required]]
  });

  constructor(
    public readonly auth: AuthService,
    private readonly fb: FormBuilder,
    private readonly notifications: TuiNotificationsService
  ) {
    super();
  }

  public onItemFormSubmit(): void {
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
      this.auth.getUserRef(user.uid).update({
        trackedItems: [...user.trackedItems, {...this.itemForm.value, id: uuidv4(), notified: false, isAvailable: false}]
      });
      this.notifications.show(`Przedmiot: ${this.itemForm.get('name').value} został dodany do obserwowanych`, {
        status: TuiNotification.Success
      }).subscribe();
      this.itemForm.reset();
    });
  }


  public onItemRemove(item: TrackedItem): void {
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
}
