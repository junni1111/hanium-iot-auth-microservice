import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  findOne(email: string) {
    return this.userRepository.find({ email });
  }

  async create(dto: CreateUserDto) {
    const newUser = User.createUser(dto);
    const user = await this.userRepository.create(newUser);

    return this.userRepository.save(user);
  }

  // findOne(email: string) {
  //   const [user] = mockUsers.filter((user) => user.email === email);
  //
  //   return user;
  // }

  // async findOne(email: string) {
  //   const [user] = await this.userRepository.find({ email });
  //   console.log(`user: `, user);
  //
  //   return user;
  // }
}
