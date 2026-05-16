import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    status: string;
    progress: number;
    repository: string;
    technologies: string[];
  }) => Promise<void>;
  initialData?: any;
}

export function ProjectModal({ open, onClose, onSubmit, initialData }: ProjectModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'Planning');
  const [progress, setProgress] = useState(initialData?.progress || 0);
  const [repository, setRepository] = useState(initialData?.repository || '');
  const [techInput, setTechInput] = useState(initialData?.technologies?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const technologies = techInput
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        status,
        progress: Number(progress),
        repository: repository.trim(),
        technologies,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit Project' : 'Create New Project'}
      description="Track active development, milestones, and status."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-xs text-destructive">{error}</p>}

        <Input
          label="Project Name"
          placeholder="e.g. Distributed Consensus Engine"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-medium text-muted-foreground">Description</label>
          <textarea
            className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            rows={3}
            placeholder="Short overview of the project's goal..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'Planning', label: 'Planning' },
              { value: 'Building', label: 'Building' },
              { value: 'Paused', label: 'Paused' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Archived', label: 'Archived' },
            ]}
          />

          <Input
            label="Progress (%)"
            type="number"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
          />
        </div>

        <Input
          label="Repository URL (optional)"
          placeholder="https://github.com/org/repo"
          value={repository}
          onChange={(e) => setRepository(e.target.value)}
        />

        <Input
          label="Technologies (comma separated)"
          placeholder="React, TypeScript, Go, Redis"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
