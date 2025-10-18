import { Schema, model, Document, Types } from 'mongoose';

export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ITask extends Document {
  ownerId: Types.ObjectId;
  projectId?: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: string[];
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['Backlog', 'Todo', 'In Progress', 'Done'],
      default: 'Todo',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    labels: [{ type: String, trim: true }],
    dueDate: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

taskSchema.index({ ownerId: 1, status: 1 });
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ ownerId: 1, priority: 1 });

export const Task = model<ITask>('Task', taskSchema);
