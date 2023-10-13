import { Injectable } from '@nestjs/common';
import { ICrypto } from 'src/domain/interface/crypto';
import * as crypto from 'crypto';

@Injectable()
export class Crypto implements ICrypto {
  randomUUID(): string {
    return crypto.randomUUID();
  }
}
