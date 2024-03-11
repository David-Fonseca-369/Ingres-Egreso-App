import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: ``,
})
export class RegisterComponent implements OnInit {
  registroForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  crearUsuario(): void {
    if (this.registroForm.invalid) {
      return;
    }

    //Hacemos des-estructuración de objetos y extraemos los campos que requerimos
    const { nombre, correo, password } = this.registroForm.value;
    this.authService
      .createUser(nombre, correo, password)
      .then((credentials) => {
        console.log(credentials);
        this.router.navigate(['/']);
      })
      .catch((error) => console.error(error));
  }
}
