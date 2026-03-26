export interface TUser {
  name: string;
  email: string;
  image: string;
  isActive: boolean;
  password: string;
  role: "admin" | "user" | "organizer";
  createdAt?: Date;
  updatedAt?: Date;
}