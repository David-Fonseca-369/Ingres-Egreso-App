import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

export const unSetItems = createAction('[Ingreso-Egreso] UnSet Items');
export const setItems = createAction(
  '[Ingreso-Egreso] Set Items',
  props<{ items: IngresoEgreso[] }>()
);
