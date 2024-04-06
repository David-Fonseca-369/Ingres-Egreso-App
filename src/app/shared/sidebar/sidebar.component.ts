import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { isLoading } from '../ui.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  username: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.userSubscription = this.store
      .select('user')
      .pipe(filter(({ user }) => user != null)) //para que no procese nulos y no se ocupe esa validación al final (user?.nombre)
      .subscribe(({ user }) => {
        this.username = user.nombre;
      });
  }
  logout() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }
}
