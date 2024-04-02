import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';

import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: ``,
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  ingresos: number = 0;
  egresos: number = 0;

  totalEgresos: number = 0;
  totalIngresos: number = 0;

  // Doughnut
  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  // public doughnutChartData: ChartData<'doughnut'> = {
  //   labels: this.doughnutChartLabels,
  //   datasets: {[]

  //     data: [1]

  //   },

  // };

  public doughnutChartData: ChartData<'bar'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [],
      },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store: Store<AppState>) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.store.select('ingresosEgresos').subscribe(({ items }) => {
      this.generarEstadistica(items);
    });
  }

  generarEstadistica(items: IngresoEgreso[]) {
    //Para que no se incrementen cunado  se actualice desde firebase u otro origen
    this.totalIngresos = 0;
    this.totalEgresos = 0;
    this.ingresos = 0;
    this.egresos = 0;

    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }

    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        {
          data: [this.totalIngresos, this.totalEgresos],

        },
      ],
    };
  }
}
