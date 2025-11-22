import { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, CalendarIcon } from 'lucide-react';
import { useCreateRelease } from '@/hooks/use-releases';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreateReleaseDialogProps {
    productId: string;
}

import styles from './CreateReleaseDialog.module.scss';
import { Input } from './ui/input';

export const CreateReleaseDialog = ({ productId }: CreateReleaseDialogProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [targetDate, setTargetDate] = useState<Date>();

    const { mutate: createRelease, isPending } = useCreateRelease();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!targetDate) {
            toast.error('Target date is required');
            return;
        }

        createRelease({
            productId,
            data: {
                targetDate: format(targetDate, 'yyyy-MM-dd'),
                name
            }
        }, {
            onSuccess: () => {
                toast.success('Release created successfully');
                setTargetDate(undefined);
                setOpen(false);
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to create release');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={styles.triggerButton}>
                    <Plus className={styles.icon} />
                    New Release
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Release</DialogTitle>
                    <DialogDescription>Add a new release for this product</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formContainer}>
                        <div className={styles.inputGroup}>
                            <Label htmlFor="name">Release Name</Label>
                            <Input id="name" placeholder="Enter release name" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className={styles.inputGroup}>
                            <Label>Target Release Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            styles.dateButton,
                                            !targetDate && styles.placeholder
                                        )}
                                    >
                                        <CalendarIcon className={styles.calendarIcon} />
                                        {targetDate ? format(targetDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={targetDate}
                                        onSelect={setTargetDate}
                                        initialFocus
                                        className={styles.calendar}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Creating...' : 'Create Release'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
