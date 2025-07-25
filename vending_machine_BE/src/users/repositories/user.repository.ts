import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@database/models/user.model';
import { Role } from '@database/models/role.model';
import { UserCreationAttributes, UserUpdateAttributes } from '@users/interfaces/user.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(userData: UserCreationAttributes): Promise<User> {
    return this.userModel.create(userData);
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByIdWithRole(id: number): Promise<User | null> {
    return this.userModel.findByPk(id, {
      include: [Role],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
    });
  }

  async findByEmailWithRole(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
      include: [Role],
    });
  }

  async update(id: number, userData: UserUpdateAttributes): Promise<[number, User[]]> {
    return this.userModel.update(userData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return this.userModel.destroy({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      include: [Role],
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: ['id'],
    });
    return !!user;
  }
}