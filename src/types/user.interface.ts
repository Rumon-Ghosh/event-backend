export interface TUser {
  name: string;
  email: string;
  image: string;
  password: string;
  role: "admin" | "user" | "organizer";
  createdAt?: Date;
  updatedAt?: Date;
}