import { Injectable } from '@nestjs/common';
import { IBcryptJS } from 'src/domain/interface/bcrypt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class Bcrypt implements IBcryptJS {
  hashSync(s: string, salt?: number): string {
    return bcrypt.hashSync(s, salt);
  }
  compareSync(s: string, hash: string): boolean {
    return bcrypt.compareSync(s, hash);
  }
}
