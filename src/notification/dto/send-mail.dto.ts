import { IsEmail, IsString } from 'class-validator';

export class SendMailDto {
  constructor(email: string, text: string) {
    this.email = email;
    this.text = text;
  }

  @IsEmail()
  email: string;

  @IsString()
  text: string;
}
