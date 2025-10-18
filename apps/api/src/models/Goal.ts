import { Schema, model, Document, Types } from 'mongoose';

export type GoalPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type GoalStatus = 'active' | 'completed' | 'missed';

export interface IGoal extends Document {
  ownerId: Types.ObjectId;
  title: string;
  period: GoalPeriod;
  target: number;
  current: number;
  deadline?: Date;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: 'weekly',
    },
    target: { type: Number, required: true, default: 1 },
    current: { type: Number, default: 0 },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ['active', 'completed', 'missed'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

goalSchema.index({ ownerId: 1, period: 1 });

export const Goal = model<IGoal>('Goal', goalSchema);
