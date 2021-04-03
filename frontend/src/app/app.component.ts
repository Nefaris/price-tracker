import { Component, OnInit } from '@angular/core';
import 'firebase/messaging';
import { SwUpdate } from '@angular/service-worker';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from './shared/components/base.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  constructor(private readonly swUpdate: SwUpdate) {
    super();
  }

  ngOnInit(): void {
    this.swUpdate.available.pipe(
      takeUntil(this.destroyed)
    ).subscribe(() => {
      alert('Dostępna jest nowa wersja aplikacji');
      this.swUpdate.activateUpdate().then(() => document.location.reload());
    });
  }
}
