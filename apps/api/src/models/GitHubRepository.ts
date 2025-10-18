import { Schema, model, Document, Types } from 'mongoose';

export interface IGitHubRepository extends Document {
  ownerId: Types.ObjectId;
  githubId: number;
  name: string;
  fullName: string;
  url: string;
  description?: string;
  private: boolean;
  language?: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const gitHubRepositorySchema = new Schema<IGitHubRepository>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    githubId: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    private: { type: Boolean, default: false },
    language: { type: String },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    openIssues: { type: Number, default: 0 },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

gitHubRepositorySchema.index({ ownerId: 1, githubId: 1 }, { unique: true });
gitHubRepositorySchema.index({ ownerId: 1, lastSyncedAt: -1 });

export const GitHubRepository = model<IGitHubRepository>('GitHubRepository', gitHubRepositorySchema);
