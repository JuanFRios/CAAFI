import { Role } from './role';

export interface User {
  id: string;
  username: string;
  identificacion: string;
  nombre: string;
  email: string;
  roles: Role[];
  token: string;
}
