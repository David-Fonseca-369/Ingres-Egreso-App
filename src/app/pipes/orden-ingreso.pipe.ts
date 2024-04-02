import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso',
})
export class OrdenIngresoPipe implements PipeTransform {
  //Se agrega el 'slice()', para que retorne el array en un nuevo array, ya que lo congela
  //Debido a que la matriz está congelada en modo estricto, deberá copiar la matriz antes de ordenarla
  //The slice() method returns selected elements in an array, as a new array.
  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    return items.slice().sort((a, b) => {
      if (a.tipo === 'ingreso') {
        //Para que lo sitúe en un indice menor y así estén al principio
        return -1;
      } else {
        return 1;
      }
    });
  }
}
