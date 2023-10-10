export class LoginDto {
  readonly email: string;
  readonly password: string;
}

export class ResponseDto {
  token: string;
  constructor(token: string) {
    this.token = token;
  }
}
