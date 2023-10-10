import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS_AUTH } from './messagePattern';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  login(email: string, password: string) {
    return this.client.send(MESSAGE_PATTERNS_AUTH.login, { email, password });
  }
}
