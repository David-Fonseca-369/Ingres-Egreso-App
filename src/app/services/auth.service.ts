import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { getAuth } from '@angular/fire/auth';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { User } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  //Se encargará de avisarnos cuando suceda algún cambio con la autenticación
  initAuthListener() {
    authState(this.auth).subscribe((fUser) => {
      console.log(fUser);
      console.log(fUser?.uid);
      console.log(fUser?.email);
      console.log(fUser?.displayName);
    });
  }
  createUser(name: string, email: string, password: string) {
    Swal.fire({
      title: 'Espere por favor...',
      didOpen: () => {
        Swal.showLoading();
      },
    });

    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredentials) => {
        //Aquí se pueden agregar también la foto de perfil
        updateProfile(userCredentials.user, { displayName: name })
          .then(() => {
            const newUser = new User(
              userCredentials.user.uid,
              name,
              userCredentials.user.email
            );
            const userRef = collection(this.firestore, `user`);
            //Agrego el usuario a la base de datos
            addDoc(userRef, { ...newUser })
              .then(() => {
                Swal.close();
                this.router.navigate(['/']);
              })
              .catch((error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: error.message,
                });
              });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message,
            });
          });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      });

    //Como es una promesa, se maneja con un then
    // .then(({ user }) => {
    //   console.log(user);
    // })
    // .catch((error) => {
    //   console.error(error);
    // })
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
