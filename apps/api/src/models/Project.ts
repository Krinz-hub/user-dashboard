import { Schema, model, Document, Types } from 'mongoose';

export type ProjectStatus = 'Planning' | 'Building' | 'Paused' | 'Completed' | 'Archived';

export interface IProject extends Document {
  ownerId: Types.ObjectId;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  repository?: string;
  technologies: string[];
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['Planning', 'Building', 'Paused', 'Completed', 'Archived'],
      default: 'Planning',
      index: true,
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    repository: { type: String, trim: true },
    technologies: [{ type: String, trim: true }],
    archivedAt: { type: Date },
  },
  { timestamps: true }
);

projectSchema.index({ ownerId: 1, status: 1 });
projectSchema.index({ ownerId: 1, createdAt: -1 });

export const Project = model<IProject>('Project', projectSchema);
