export interface IBcryptJS {
  hashSync(s: string, salt?: number): string;
  compareSync(s: string, hash: string): boolean;
}
