import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  onSnapshot,
} from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
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

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    console.log(ingresoEgreso);
    const userId = this.authService.getUser().uid;
    const collectionReference = collection(
      this.firestore,
      `ingresos-egresos/items/${userId}`
    );
    const docRef = addDoc(collectionReference, { ...ingresoEgreso });
    console.log(docRef);

    return docRef;
  }

  async initEgresosEgresosListener(uid: string) {
    // const userRef = collection(this.firestore, 'ingresos-egresos/items')
    // const q = query(userRef, where("uid", "==",uid));
    // const querySnapshot = (await getDocs(q))
    // querySnapshot.forEach((doc: any) => {
    //   console.log(doc.data())
    // })
    // collection(this.firestore,`${uid}/ingresos-egresos/items`).valueChanges

    const userRef = collection(this.firestore, `ingresos-egresos/items/${uid}`);
    const q = query(userRef);

    // // Obtiene los documentos que cumplen con la consulta
    // getDocs(q).then((querySnapshot) => {
    //   console.log(querySnapshot.docs);
    //   const data: IngresoEgreso[] = [];
    //   querySnapshot.forEach((doc) => {
    //     // Agrega los datos de cada documento al array
    //     const { monto, descripcion, tipo } = doc.data();
    //     data.push({
    //       // uid: doc.id,
    //       monto: monto,
    //       descripcion: descripcion,
    //       tipo: tipo,
    //     });
    //   });
    //   this.store.dispatch(ingresosEgresosActions.setItems({ items: data }));
    // });

     // Establece el listener para cambios en la colección
     onSnapshot(q, (querySnapshot) => {
      const data: IngresoEgreso[] = [];
      querySnapshot.forEach((doc) => {
        const { monto, descripcion, tipo } = doc.data();
        data.push({
          monto: monto,
          descripcion: descripcion,
          tipo: tipo,
        });
      });
      // Despacha la acción para actualizar el estado de la aplicación
      this.store.dispatch(ingresosEgresosActions.setItems({ items: data }));
    });
  }
}
