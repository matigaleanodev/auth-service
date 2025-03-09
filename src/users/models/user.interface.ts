export interface UserInterface {
  id: number;
  email: string;
  password?: string;
  refreshToken: string | null;
  createdAt: Date;
}
