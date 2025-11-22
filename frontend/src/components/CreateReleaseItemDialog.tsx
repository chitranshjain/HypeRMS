import { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useCreateReleaseItem } from '@/hooks/use-release-items';
import { ItemType, ItemStage } from '@/types/release';
import { toast } from 'sonner';

interface CreateReleaseItemDialogProps {
    releaseId: string;
}

import styles from './CreateReleaseItemDialog.module.scss';

export const CreateReleaseItemDialog = ({ releaseId }: CreateReleaseItemDialogProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<ItemType>('FEATURE');
    const [stage, setStage] = useState<ItemStage>('DEV');
    const [jiraLink, setJiraLink] = useState('');
    const [docLink, setDocLink] = useState('');

    const { mutate: createItem, isPending } = useCreateReleaseItem();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        createItem({
            releaseId,
            data: {
                title,
                description,
                type,
                jiraLink: jiraLink || undefined,
                docLink: docLink || undefined,
            }
        }, {
            onSuccess: () => {
                toast.success('Release item created successfully');
                setTitle('');
                setDescription('');
                setJiraLink('');
                setDocLink('');
                setType('FEATURE');
                setStage('DEV');
                setOpen(false);
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to create item');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={styles.triggerButton}>
                    <Plus className={styles.icon} />
                    New Item
                </Button>
            </DialogTrigger>
            <DialogContent className={styles.dialogContent}>
                <DialogHeader>
                    <DialogTitle>Create Release Item</DialogTitle>
                    <DialogDescription>Add a new item to this release</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formContainer}>
                        <div className={styles.inputGroup}>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter item title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter item description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className={styles.gridContainer}>
                            <div className={styles.inputGroup}>
                                <Label htmlFor="type">Type</Label>
                                <Select value={type} onValueChange={(v) => setType(v as ItemType)}>
                                    <SelectTrigger id="type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FEATURE">Feature</SelectItem>
                                        <SelectItem value="BUG_FIX">Bug Fix</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className={styles.inputGroup}>
                                <Label htmlFor="stage">Stage</Label>
                                <Select value={stage} onValueChange={(v) => setStage(v as ItemStage)}>
                                    <SelectTrigger id="stage">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DEV">Development</SelectItem>
                                        <SelectItem value="PRE_PROD">Pre-Production</SelectItem>
                                        <SelectItem value="RELEASED">Released</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <Label htmlFor="jiraLink">Jira Link (optional)</Label>
                            <Input
                                id="jiraLink"
                                type="url"
                                placeholder="https://jira.example.com/..."
                                value={jiraLink}
                                onChange={(e) => setJiraLink(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <Label htmlFor="docLink">Documentation Link (optional)</Label>
                            <Input
                                id="docLink"
                                type="url"
                                placeholder="https://docs.example.com/..."
                                value={docLink}
                                onChange={(e) => setDocLink(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Creating...' : 'Create Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
