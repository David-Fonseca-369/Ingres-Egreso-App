import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
} from '@angular/fire/firestore';
import { IngresoEgreso, IngresoEgresoCreate } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ingresosEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  items$: Observable<IngresoEgreso[]>;
  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private store: Store<AppState>
  ) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgresoCreate) {
    const userId = this.authService.getUser().uid;

    //Podemos eliminar la propiedad y no se crea la otra clase
    // delete ingresoEgreso.uid;

    const docRef = doc(this.firestore, `${userId}/ingresos-egresos`);
    const itemsCollectionRef = collection(docRef, 'items');

    const createRef = addDoc(itemsCollectionRef, { ...ingresoEgreso });
    return createRef;
  }

  async initEgresosEgresosListener(uid: string) {
    // const userRef = collection(this.firestore, `ingresos-egresos/items/${uid}`);
    const userRef = collection(this.firestore, `${uid}/ingresos-egresos/items`);
    const q = query(userRef);
    // Establece el listener para cambios en la colección
    onSnapshot(q, (querySnapshot) => {
      const data: IngresoEgreso[] = [];
      querySnapshot.forEach((doc) => {
        const { monto, descripcion, tipo } = doc.data();
        data.push({
          uid: doc.id,
          monto: monto,
          descripcion: descripcion,
          tipo: tipo,
        });
      });
      // Despacha la acción para actualizar el estado de la aplicación
      this.store.dispatch(ingresosEgresosActions.setItems({ items: data }));
    });
  }

  borrarIngresoEgreso(uidItem: string) {
    const userId = this.authService.getUser().uid;

    const docRef = doc(
      this.firestore,
      `${userId}/ingresos-egresos/items/${uidItem}`
    );

    return deleteDoc(docRef);
  }
}
