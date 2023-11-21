import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;
}

export class UpdateUserDto {
  @IsNumber()
  readonly id: number;

  readonly firstName: string;

  readonly lastName: string;

  readonly email: string;

  readonly password: string;
}
