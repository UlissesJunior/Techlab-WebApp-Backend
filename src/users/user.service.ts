import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(name: string, email: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ name, email, passwordHash });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async uploadPhoto(id: string, base64Photo: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    user.photo = base64Photo;
    await this.usersRepository.save(user);
  }

  async getPhotoById(id: string): Promise<string | null> {
    const user = await this.usersRepository.findOne({
      where: { id }
    });
    console.log("GETPHOTO")
    console.log(user)
    return user?.photo ?? null;
  }  
}
