import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { SendMailDto } from './dto/send-mail.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  requestUrl(url: string) {
    const NOTIFICATION_HOST = this.configService.get<string>(
      'NOTIFICATION_HOST',
      '0.0.0.0',
    );
    const NOTIFICATION_PORT = this.configService.get<number>(
      'NOTIFICATION_PORT_10000_TCP_PORT',
      10000,
    );
    return `http://${NOTIFICATION_HOST}:${NOTIFICATION_PORT}/${url}`;
  }

  sendEmail(sendMailDto: SendMailDto) {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('email'), sendMailDto),
    ).then((res) => res.data);
  }

  sendMessage(sendMessageDto: SendMessageDto) {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('telegram'), sendMessageDto),
    ).then((res) => res.data);
  }
}
