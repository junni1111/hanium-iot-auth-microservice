import { IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
  constructor(chatId: number, text: string) {
    this.chatId = chatId;
    this.text = text;
  }

  @IsNumber()
  chatId: number;

  @IsString()
  text: string;
}
