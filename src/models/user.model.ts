import { model, Schema } from "mongoose";
import { TUser } from "../types/user.interface";
import bcrypt from "bcrypt"
import config from "../config";

const userSchema = new Schema<TUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  image: { type: String, required: true },
  role: { type: String, enum: ["admin", "user", "organizer"], default: "user" },
  password: {type: String, required: true, select: false}
},
  {
  timestamps: true,
}
)

userSchema.pre('save', async function () {
  const user = this;

  if (!user.isModified('password')) return;

  user.password = await bcrypt.hash(
    user.password as string,
    Number(config.bcrypt_salt_rounds)
  );
});


userSchema.post('save', function (user, next) {
  console.log(`[Post-Save Hook]: A new user was created with email: ${user.email}`);

  user.password = '';
  
  next();
});

export const User = model<TUser>("User", userSchema)