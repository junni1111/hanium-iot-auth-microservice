import { IsString } from 'class-validator';

export class ValidateJwtDto {
  @IsString()
  public readonly jwt: string;
}
