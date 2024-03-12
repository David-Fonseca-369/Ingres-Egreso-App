import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

export const isAuthenticatedGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuth().pipe(
    //Disparo el efecto secundario
    tap((status) => {
      if (!status) {
        router.navigate(['/login']);
      }
    })
  );
};
