import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  preferences: {
    theme: 'dark' | 'light';
    focusDurationMinutes: number;
    breakDurationMinutes: number;
  };
  githubToken?: string;
  githubUsername?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String },
    preferences: {
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
      focusDurationMinutes: { type: Number, default: 25 },
      breakDurationMinutes: { type: Number, default: 5 },
    },
    githubToken: { type: String },
    githubUsername: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
