import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IngresoEgresoComponent } from './ingreso-egreso/ingreso-egreso.component';
import { EstadisticaComponent } from './ingreso-egreso/estadistica/estadistica.component';
import { DetalleComponent } from './ingreso-egreso/detalle/detalle.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//NGRX
//npm install @ngrx/store --save
import { StoreModule } from "@ngrx/store";
import { appReducers } from './app.reducer';
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

//Store Devtools
// npm install @ngrx/store-devtools --save

//Formularios reactivos
import { ReactiveFormsModule } from '@angular/forms';

//AngularFire
//ng add @angular/fire@next
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { OrdenIngresoPipe } from './pipes/orden-ingreso.pipe';

//Bootstrap
// ng add @ng-bootstrap/ng-bootstrap

//ng add ng2-charts | https://valor-software.com/ng2-charts/
import { BaseChartDirective } from 'ng2-charts';
import {
  provideCharts,
  withDefaultRegisterables,
  } from 'ng2-charts';
//generate environments
// ng g environments

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    IngresoEgresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    OrdenIngresoPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    // CONFIGURACIÓN DE FIREBASE
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    //Indicarle a la aplicación que estará trabajando con ngrx
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, //Retains last 25 states
      logOnly: environment.production //Restrict extension to log-only mode
    }),
    BaseChartDirective
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
