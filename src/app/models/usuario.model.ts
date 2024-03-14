export class User {
  //Hacemos des estructuración para obtener ciertas propiedades
  static fromFirebase({ email, uid, nombre }) {
    return new User(uid, nombre, email);
  }
  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {}
}
