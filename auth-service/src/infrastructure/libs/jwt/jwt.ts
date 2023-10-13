import { Injectable } from '@nestjs/common';
import { IJwt } from 'src/domain/interface/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Jwt implements IJwt {
  sign(payload: any, privateKey: string): string {
    return jwt.sign(payload, privateKey);
  }
  verify(token: string, privateKey: string): any {
    return jwt.verify(token, privateKey);
  }
}
