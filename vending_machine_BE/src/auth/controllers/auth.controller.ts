import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '@auth/services/auth.service';
import { LoginDto, RegisterDto } from '@auth/dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Get('seller-only')
  async sellerOnlyEndpoint() {
    return { message: 'This endpoint is only accessible by sellers' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer')
  @Get('buyer-only')
  async buyerOnlyEndpoint() {
    return { message: 'This endpoint is only accessible by buyers' };
  }
}
