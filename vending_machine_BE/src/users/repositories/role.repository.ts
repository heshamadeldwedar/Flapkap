import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@database/models/role.model';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {}

  async findById(id: number): Promise<Role | null> {
    return this.roleModel.findByPk(id);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({
      where: { name },
    });
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll();
  }

  async create(roleData: { name: string; description?: string }): Promise<Role> {
    return this.roleModel.create(roleData);
  }

  async existsById(id: number): Promise<boolean> {
    const role = await this.roleModel.findByPk(id, {
      attributes: ['id'],
    });
    return !!role;
  }

  async existsByName(name: string): Promise<boolean> {
    const role = await this.roleModel.findOne({
      where: { name },
      attributes: ['id'],
    });
    return !!role;
  }
}