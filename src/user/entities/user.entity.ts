import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  Index,
} from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

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

  public static createUser({ email, password, username }: CreateUserDto) {
    const user = new User();
    user.email = email;
    user.password = password;
    user.username = username;

    return user;
  }
}
