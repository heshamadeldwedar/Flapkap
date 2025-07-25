import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../database/models/user.model';
import { Role } from '../database/models/role.model';
import { RegisterDto } from '../auth/dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const { email, password, role_id } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Find role by name
    const roleEntity = await this.roleModel.findOne({ where: { id: role_id } });
    if (!roleEntity) {
      throw new NotFoundException(`Role ${role_id} not found`);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      role_id: roleEntity.id,
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      include: [Role],
    });
  }

  async findByIdWithRole(id: number): Promise<User | null> {
    return this.userModel.findByPk(id, {
      include: [Role],
    });
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
