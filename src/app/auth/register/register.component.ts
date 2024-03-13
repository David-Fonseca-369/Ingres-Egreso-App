import { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import * as actions from '../../shared/ui.actions';
import { Auth, updateProfile } from '@angular/fire/auth';
import { User } from '../../models/usuario.model';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: ``,
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm: FormGroup;
  isLoading: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private auth: Auth,
    private store: Store<AppState>,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    //Aquí puede haber una fuga de memoria, ya que cada que se carga este se suscribe, por lo que hay que destruir la suscripción
    //Suscripción
    this.uiSubscription = this.store
      .select('ui')
      .subscribe((ui) => (this.isLoading = ui.isLoading));
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(): void {
    if (this.registroForm.invalid) {
      return;
    }

    this.store.dispatch(actions.isLoading());

    //Hacemos des-estructuración de objetos y extraemos los campos que requerimos
    const { nombre, correo, password } = this.registroForm.value;

    this.authService
      .createUser(nombre, correo, password)
      .then((userCredentials) => {
        //Aquí se pueden agregar también la foto de perfil
        updateProfile(userCredentials.user, { displayName: nombre })
          .then(() => {
            const newUser = new User(
              userCredentials.user.uid,
              nombre,
              userCredentials.user.email
            );
            const userRef = collection(this.firestore, `user`);
            //Agrego el usuario a la base de datos
            addDoc(userRef, { ...newUser })
              .then(() => {
                //Ya que ejecuto el resto de servicios, lo paro
                this.store.dispatch(actions.stopLoading());
                this.router.navigate(['/']);
              })
              .catch((error) => {
                this.store.dispatch(actions.stopLoading());
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: error.message,
                });
              });
          })
          .catch((error) => {
            this.store.dispatch(actions.stopLoading());
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message,
            });
          });
      })
      .catch((error) => {
        this.store.dispatch(actions.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      });
  }
}
