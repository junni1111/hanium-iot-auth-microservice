import { BadRequestException, Injectable } from '@nestjs/common';
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
    console.log(`Call FInd ONE`);
    return this.userRepository.findOne({ email });
  }

  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(User.createUser(dto));
      return this.userRepository.save(user);
    } catch (e) {
      /** Todo: Handle Already Exist User Exception */
    }
  }

  // /** Todo: Replace to JWT */
  // async signIn({ email }: CreateUserDto) {
  //   return this.userRepository.find({ email });
  // }

  async signUp(dto: CreateUserDto) {
    const exist = await this.userRepository.findOne({ email: dto.email });
    console.log(`find result: `, exist);
    if (exist) {
      return new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const user = await this.userRepository.create(User.createUser(dto));
    return await this.userRepository.save(user);
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
