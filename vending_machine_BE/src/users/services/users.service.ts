import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository, RoleRepository } from '@users/repositories';
import { RegisterDto } from '@auth/dto';
import { UpdateUserDto, UserResponseDto } from '@users/dto';
import { User } from '@database/models/user.model';
import {
  UserCreationAttributes,
  UserUpdateAttributes,
} from '@users/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const { email, password, role_id } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.existsByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if role exists
    const roleExists = await this.roleRepository.existsById(role_id);
    if (!roleExists) {
      throw new NotFoundException(`Role ${role_id} not found`);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData: UserCreationAttributes = {
      email,
      password: hashedPassword,
      role_id,
    };

    return this.userRepository.create(userData);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByEmailWithRole(email: string): Promise<User | null> {
    return this.userRepository.findByEmailWithRole(email);
  }

  async findByIdWithRole(id: number): Promise<User | null> {
    return this.userRepository.findByIdWithRole(id);
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findByIdWithRole(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it conflicts
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.existsByEmail(
        updateUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Check if role exists
    if (updateUserDto.role_id) {
      const roleExists = await this.roleRepository.existsById(
        updateUserDto.role_id,
      );
      if (!roleExists) {
        throw new NotFoundException(`Role ${updateUserDto.role_id} not found`);
      }
    }

    // Hash password if provided
    const updateData: UserUpdateAttributes = { ...updateUserDto };
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
