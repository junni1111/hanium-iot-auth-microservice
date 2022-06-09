import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  Index,
  BeforeInsert,
} from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { Logger } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { HASH_ROUNDS } from '../../config/crypto.config';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'create_at' })
  createAt: Date;

  @BeforeInsert()
  async hashPassword() {
    try {
      const salt = await genSalt(HASH_ROUNDS);
      this.password = await hash(this.password, salt);
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  public static createUser({ email, password, username }: CreateUserDto) {
    const user = new User();
    user.email = email;
    user.password = password;
    user.username = username;

    return user;
  }
}
