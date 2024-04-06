import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';
//import { isAuthenticatedGuard } from '../services/guards';

const rutasHijas: Routes = [
  //Le pasamos las rutas hijas
  {
    path: '',
    component: DashboardComponent,
    children: dashboardRoutes,
    //canActivate: [isAuthenticatedGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [
    //no forRoot(), porque no se está como rutas principales
    //se usa forChild porque se agregan rutas hijas
    RouterModule.forChild(rutasHijas)
  ],
  exports: [
    //Lo exportamos para decirle a Angular que dispone de la nueva configuración en las rutas
    RouterModule
  ]
})
export class DashboardRoutesModule {}
