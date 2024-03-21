import { Injectable } from '@angular/core';
import { Firestore, doc, collection, addDoc } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const userId = this.authService.getUser().uid;
    const collectionReference = collection(
      this.firestore,
      `ingresos-egresos/items/${userId}`
    );
    const docRef = addDoc(collectionReference, { ...ingresoEgreso });
    return docRef;
  }
}
