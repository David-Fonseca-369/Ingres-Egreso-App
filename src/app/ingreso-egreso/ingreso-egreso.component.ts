import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso, IngresoEgresoCreate } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as uiActions from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: ``,
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  isLoading: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.isLoading = ui.isLoading;
    });
  }
  ngOnDestroy(): void {
    //Ejecuta cuando la página es destruida y se encarga de hacer limpiezas
    this.uiSubscription.unsubscribe();
  }
  guardar() {
    if (this.ingresoForm.invalid) {
      return;
    }
    this.store.dispatch(uiActions.isLoading());

    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgresoCreate(descripcion, monto, this.tipo);

    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.store.dispatch(uiActions.stopLoading());
        this.ingresoForm.reset();
        Swal.fire({
          icon: 'success',
          title: '¡Registro creado!',
          text: descripcion,
        });
      })
      .catch((error) => {
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      });
  }
}
