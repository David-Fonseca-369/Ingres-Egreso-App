export class IngresoEgresoCreate {
  constructor(
    public descripcion: string,
    public monto: number,
    public tipo: string,
  ) {}
}

export class IngresoEgreso {
  constructor(
    public descripcion: string,
    public monto: number,
    public tipo: string,
    public uid?: string
  ){}
}
