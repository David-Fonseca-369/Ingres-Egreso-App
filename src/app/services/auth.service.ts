import { Injectable } from '@angular/core';
import {
  Auth,
  Unsubscribe,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { User } from '../models/usuario.model';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userUnsubscribe!: Unsubscribe;
  //Se deja en privado para que no tengan acceso a esta propiedad

  private _user: User;

  //Para prevenir mutaciones a este user
  getUser() {
    return { ...this._user };
  }

  constructor(
    private auth: Auth,
    private store: Store<AppState>,
    private firestore: Firestore
  ) {}

  //Se encargará de avisarnos cuando suceda algún cambio con la autenticación
  initAuthListener() {
    authState(this.auth).subscribe(async (fUser) => {

      if (fUser) {
        const docRef = doc(this.firestore, `${fUser.uid}/users`);

        // Establecer el listener para cambios en el documento
        onSnapshot(docRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const { uid, nombre, email } = docSnapshot.data();
            const user: User = {
              uid,
              nombre,
              email,
            };

            this._user = user;
            this.store.dispatch(authActions.setUser({ user: user }));
          } else {
            // El documento no existe
            console.error(`El documento ${fUser.uid} no existe`);
          }
        });
      } else {
        this._user = null;
        this.userUnsubscribe ? this.userUnsubscribe() : null;
        this.store.dispatch(authActions.unSetUser());
        //Limpie items
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }
    });
  }
  createUser(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isAuth() {
    return authState(this.auth).pipe(map((fUser) => fUser !== null));
  }
}
