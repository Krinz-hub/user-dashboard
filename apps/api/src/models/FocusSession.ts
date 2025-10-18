import { Schema, model, Document, Types } from 'mongoose';

export type FocusSessionStatus = 'active' | 'completed' | 'interrupted';

export interface IFocusSession extends Document {
  ownerId: Types.ObjectId;
  projectId?: Types.ObjectId;
  taskId?: Types.ObjectId;
  startedAt: Date;
  endedAt?: Date;
  duration: number; // in minutes
  status: FocusSessionStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const focusSessionSchema = new Schema<IFocusSession>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    duration: { type: Number, default: 25 },
    status: {
      type: String,
      enum: ['active', 'completed', 'interrupted'],
      default: 'active',
      index: true,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

focusSessionSchema.index({ ownerId: 1, startedAt: -1 });

export const FocusSession = model<IFocusSession>('FocusSession', focusSessionSchema);
