import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hash } from 'bcrypt';
import { HASH_ROUNDS } from '../config/crypto.config';

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

  async signUp(createUserDto: CreateUserDto) {
    const exist = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    Logger.debug(`Find User: `, exist?.email);

    if (exist) {
      return new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const salt = await genSalt(HASH_ROUNDS);
    createUserDto.password = await hash(createUserDto.password, salt);

    const user = await this.userRepository.create(
      User.createUser(createUserDto),
    );

    console.log(`Save User: `, user);

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
