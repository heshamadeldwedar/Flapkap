import { Role } from '@database/models/role.model';

export interface UserInterface {
  id?: number;
  email: string;
  password: string;
  role_id: number;
  role?: Role;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes {
  email: string;
  password: string;
  role_id: number;
}

export interface UserUpdateAttributes {
  email?: string;
  password?: string;
  role_id?: number;
}
