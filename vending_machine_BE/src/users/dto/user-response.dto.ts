import { Role } from '@database/models/role.model';

export class UserResponseDto {
  id: number;
  email: string;
  role_id: number;
  role?: Role;
  created_at: Date;
  updated_at: Date;
}
