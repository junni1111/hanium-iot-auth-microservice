import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { NotificationService } from '../notification/notification.service';
import { SendMailDto } from '../notification/dto/send-mail.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  findOne(email: string) {
    return this.userRepository.findOne({ email });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, username } = createUserDto;
    try {
      const user = await this.userRepository.create({
        email,
        password,
        username,
      });

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
    const { email, password, username, phoneNumber, role } = createUserDto;
    try {
      const exist = await this.userRepository.findOne({
        email,
      });
      Logger.debug(`Find User: `, exist?.email);

      if (exist) {
        throw new BadRequestException('Email Exist');
      }

      const user = await this.userRepository.create({
        email,
        password,
        username,
        phoneNumber,
        role,
      });

      console.log(`Save User: `, user);

      this.notificationService.sendEmail(new SendMailDto(email, 'hello'));

      return this.userRepository.save(user);
    } catch (e) {
      throw e;
    }
  }

  async clearUserDB() {
    return await this.userRepository.createQueryBuilder().delete().execute();
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
