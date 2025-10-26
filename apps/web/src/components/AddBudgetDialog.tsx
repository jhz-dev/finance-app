import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isAxiosError } from 'axios';

export function AddBudgetDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const mutation = useMutation({
    mutationFn: () => api.post('/budgets', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      alert('Budget created successfully!');
      setOpen(false); // Close the dialog on success
      setName(''); // Reset the input
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        alert(error.response?.data.message || 'Failed to create budget.');
      } else {
        alert('An unexpected error occurred.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      mutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Budget</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black/60 text-white border-white/20 glass-effect">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              Give your new budget a name. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 bg-black/20 border-white/20"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save budget'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
