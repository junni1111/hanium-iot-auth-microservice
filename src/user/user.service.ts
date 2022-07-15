import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  async signUp(createUserDto: CreateUserDto) {
    try {
      const exist = await this.userRepository.findOne({
        email: createUserDto.email,
      });
      Logger.debug(`Find User: `, exist?.email);

      if (exist) {
        throw new BadRequestException('Email Exist');
      }

      const user = await this.userRepository.create(
        User.createUser(createUserDto),
      );

      console.log(`Save User: `, user);

      return this.userRepository.save(user);
    } catch (e) {
      throw e;
    }
  }
}
