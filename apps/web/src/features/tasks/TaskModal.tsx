import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  projects?: Array<{ _id: string; name: string }>;
  initialData?: any;
}

export function TaskModal({ open, onClose, onSubmit, projects = [], initialData }: TaskModalProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [projectId, setProjectId] = useState(initialData?.projectId || '');
  const [status, setStatus] = useState(initialData?.status || 'Todo');
  const [priority, setPriority] = useState(initialData?.priority || 'Medium');
  const [labelsInput, setLabelsInput] = useState(initialData?.labels?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const labels = labelsInput
        .split(',')
        .map((l: string) => l.trim())
        .filter(Boolean);

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        projectId: projectId || undefined,
        status,
        priority,
        labels,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectOptions = [
    { value: '', label: 'None (Standalone Task)' },
    ...projects.map((p) => ({ value: p._id, label: p.name })),
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit Task' : 'Create New Task'}
      description="Define an actionable engineering task."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-xs text-destructive">{error}</p>}

        <Input
          label="Task Title"
          placeholder="e.g. Implement refresh token rotation"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-medium text-muted-foreground">Description</label>
          <textarea
            className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            rows={2}
            placeholder="Implementation details, criteria, notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            options={projectOptions}
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'Backlog', label: 'Backlog' },
              { value: 'Todo', label: 'Todo' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Done', label: 'Done' },
            ]}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Urgent', label: 'Urgent' },
            ]}
          />
        </div>

        <Input
          label="Labels (comma separated)"
          placeholder="backend, auth, security"
          value={labelsInput}
          onChange={(e) => setLabelsInput(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
