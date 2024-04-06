import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { IngresoEgresoComponent } from './ingreso-egreso.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { DetalleComponent } from './detalle/detalle.component';
import { OrdenIngresoPipe } from '../pipes/orden-ingreso.pipe';
//Formularios reactivos
import { ReactiveFormsModule } from '@angular/forms';

//Gráfica de Chart
//ng add ng2-charts | https://valor-software.com/ng2-charts/
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutesModule } from '../dashboard/dashboard-routes.module';
import { StoreModule } from '@ngrx/store';
import { ingresoEgresoReducer } from './ingreso-egreso.reducer';

@NgModule({
  declarations: [
    DashboardComponent,
    IngresoEgresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    OrdenIngresoPipe,
  ],
  imports: [

    CommonModule,
    //forRoot es para el modulo principal | forFeature para LazyLoad Store
    StoreModule.forFeature('ingresosEgresos', ingresoEgresoReducer),
    ReactiveFormsModule,
    BaseChartDirective,
    SharedModule, //Navbar, sidebar, footer | no se importa en el app.module, ya que se cargan hasta que se autentica e inicia este modulo
    DashboardRoutesModule
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class IngresoEgresoModule {}
