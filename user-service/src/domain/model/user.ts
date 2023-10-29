export enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

export class UserM {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  role: ROLE;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}
