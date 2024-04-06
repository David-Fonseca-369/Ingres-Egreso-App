import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//NGRX
//npm install @ngrx/store --save
import { StoreModule } from '@ngrx/store';
import { appReducers } from './app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

//Store Devtools
// npm install @ngrx/store-devtools --save

//AngularFire
//ng add @angular/fire@next
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

//Bootstrap
// ng add @ng-bootstrap/ng-bootstrap

//Módulos de la aplicación
import { AuthModule } from './auth/auth.module';

//generate environments
// ng g environments

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,

    AuthModule, // Modulo de autenticación
    // IngresoEgresoModule,

    AppRoutingModule,
    NgbModule,
    // CONFIGURACIÓN DE FIREBASE
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    //Indicarle a la aplicación que estará trabajando con ngrx
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, //Retains last 25 states
      logOnly: environment.production, //Restrict extension to log-only mode
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
