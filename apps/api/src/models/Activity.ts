import { Schema, model, Document, Types } from 'mongoose';

export type ActivitySource = 'github' | 'devos' | 'ai' | 'focus';

export interface IActivity extends Document {
  ownerId: Types.ObjectId;
  source: ActivitySource;
  type: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    source: {
      type: String,
      enum: ['github', 'devos', 'ai', 'focus'],
      required: true,
    },
    type: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activitySchema.index({ ownerId: 1, timestamp: -1 });

export const Activity = model<IActivity>('Activity', activitySchema);
