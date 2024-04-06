import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription, filter } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.userSubs = this.store
      .select('user')
      .pipe(
        //Deja pasar si es true
        filter((auth) => auth.user != null)
      )
      .subscribe(({ user }) => {
        this.ingresoEgresoService.initEgresosEgresosListener(user.uid)
      });
  }
  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
  }
}
