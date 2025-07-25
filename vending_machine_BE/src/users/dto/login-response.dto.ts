import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  user: UserResponseDto;
  access_token: string;
}
