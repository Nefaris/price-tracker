import { Subject } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';


@Component({template: ''})
export class BaseComponent implements OnDestroy {
  public destroyed = new Subject();
  public isRequestPending = false;

  constructor() {
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
