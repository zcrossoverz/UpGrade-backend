export interface IJwt {
  sign(payload: any, privateKey: string): string;
  verify(token: string, privateKey: string): any;
}
