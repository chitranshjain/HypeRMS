import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateReleaseItem, useUpdateReleaseItemStatus, useAddPrerequisite, useUpdatePrerequisiteStatus, useReleaseItem } from '@/hooks/use-release-items';
import { ReleaseItem, ItemType, ItemStage, PrerequisiteCategory, Prerequisite } from '@/types/release';
import { toast } from 'sonner';
import { Plus, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface EditItemSheetProps {
    releaseId: string;
    itemId: string | null;
    open: boolean;
    onClose: () => void;
}

import styles from './EditItemSheet.module.scss';

export const EditItemSheet = ({ releaseId, itemId, open, onClose }: EditItemSheetProps) => {
    const { data: item, isLoading } = useReleaseItem(itemId || '');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<ItemType>('FEATURE');
    const [stage, setStage] = useState<ItemStage>('DEV');
    const [jiraLink, setJiraLink] = useState('');
    const [docLink, setDocLink] = useState('');
    const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([]);
    const [newPrereqCategory, setNewPrereqCategory] = useState<PrerequisiteCategory>('ENV_VAR');
    const [newPrereqDesc, setNewPrereqDesc] = useState('');

    const { mutateAsync: updateItem } = useUpdateReleaseItem();
    const { mutateAsync: updateItemStatus } = useUpdateReleaseItemStatus();
    const { mutateAsync: addPrerequisite } = useAddPrerequisite();
    const { mutateAsync: updatePrereqStatus } = useUpdatePrerequisiteStatus();

    const isReleased = item?.stage === 'RELEASED';

    useEffect(() => {
        if (item) {
            setTitle(item.title);
            setDescription(item.description);
            setType(item.type);
            setStage(item.stage);
            setJiraLink(item.jiraLink || '');
            setDocLink(item.docLink || '');
            setPrerequisites(item.prerequisites);
        }
    }, [item]);

    const allPrerequisitesDone = prerequisites.every(p => p.stage === 'DONE');

    const handleAddPrerequisite = async () => {
        if (!newPrereqDesc.trim()) {
            toast.error('Prerequisite description is required');
            return;
        }

        try {
            const newPrereq = await addPrerequisite({
                itemId: item.id,
                data: {
                    title: newPrereqDesc,
                    category: newPrereqCategory,
                }
            });

            setPrerequisites([...prerequisites, newPrereq]);
            setNewPrereqDesc('');
            toast.success('Prerequisite added');
        } catch (error) {
            toast.error('Failed to add prerequisite');
        }
    };

    const handleTogglePrerequisite = async (prereqId: string) => {
        const prereq = prerequisites.find(p => p.id === prereqId);
        if (!prereq) return;

        const newStatus = prereq.stage === 'PENDING' ? 'DONE' : 'PENDING';

        try {
            const updatedPrereq = await updatePrereqStatus({
                prerequisiteId: prereqId,
                data: { status: newStatus }
            });

            setPrerequisites(prerequisites.map(p =>
                p.id === prereqId ? updatedPrereq : p
            ));
        } catch (error) {
            toast.error('Failed to update prerequisite status');
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) {
            toast.error('Title and description are required');
            return;
        }

        try {
            // Update basic details
            await updateItem({
                itemId: item.id,
                data: {
                    title,
                    description,
                    type,
                    jiraLink: jiraLink || undefined,
                    docLink: docLink || undefined,
                }
            });

            // Update status if changed
            if (stage !== item.stage) {
                await updateItemStatus({
                    itemId: item.id,
                    data: { status: stage.toUpperCase().replace('-', '_') } // API expects DEV, PRE_PROD, RELEASED
                });
            }

            toast.success('Item updated successfully');
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update item');
        }
    };

    const categoryLabels: Record<PrerequisiteCategory, string> = {
        'ENV_VAR': 'Environment Variable',
        'MIGRATION': 'Migration',
        'INFRA': 'Infrastructure',
        'PERMISSIONS': 'Permissions',
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className={styles.sheetContent}>
                {isLoading || !item ? (
                    <div className={styles.loadingContainer}>
                        <p>Loading item details...</p>
                    </div>
                ) : (
                    <>
                        <SheetHeader>
                            <SheetTitle>{isReleased ? 'View Release Item' : 'Edit Release Item'}</SheetTitle>
                            <SheetDescription>
                                {isReleased ? 'This item has been released and cannot be edited' : 'Update item details and manage prerequisites'}
                            </SheetDescription>
                        </SheetHeader>

                        <div className={styles.formContainer}>
                            <div className={styles.inputGroup}>
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                    id="edit-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isReleased}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    disabled={isReleased}
                                />
                            </div>

                            <div className={styles.gridContainer}>
                                <div className={styles.inputGroup}>
                                    <Label htmlFor="edit-type">Type</Label>
                                    <Select value={type} onValueChange={(v) => setType(v as ItemType)} disabled={isReleased}>
                                        <SelectTrigger id="edit-type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FEATURE">Feature</SelectItem>
                                            <SelectItem value="BUG_FIX">Bug Fix</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <Label htmlFor="edit-stage">Stage</Label>
                                    <Select
                                        value={stage}
                                        onValueChange={(v) => {
                                            if (v === 'RELEASED' && !allPrerequisitesDone) {
                                                toast.error('Complete all prerequisites before releasing');
                                                return;
                                            }
                                            setStage(v as ItemStage);
                                        }}
                                        disabled={isReleased}
                                    >
                                        <SelectTrigger id="edit-stage">
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
                                <Label htmlFor="edit-jiraLink">Jira Link</Label>
                                <Input
                                    id="edit-jiraLink"
                                    type="url"
                                    value={jiraLink}
                                    onChange={(e) => setJiraLink(e.target.value)}
                                    placeholder="https://jira.example.com/..."
                                    disabled={isReleased}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <Label htmlFor="edit-docLink">Documentation Link</Label>
                                <Input
                                    id="edit-docLink"
                                    type="url"
                                    value={docLink}
                                    onChange={(e) => setDocLink(e.target.value)}
                                    placeholder="https://docs.example.com/..."
                                    disabled={isReleased}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className={styles.prerequisitesHeader}>
                                    <Label className={styles.prerequisitesLabel}>Prerequisites</Label>
                                    {prerequisites.length > 0 && (
                                        <Badge variant={allPrerequisitesDone ? 'success' : 'warning'}>
                                            {prerequisites.filter(p => p.stage === 'DONE').length}/{prerequisites.length} Done
                                        </Badge>
                                    )}
                                </div>

                                {prerequisites.length > 0 && (
                                    <div className={styles.prerequisitesList}>
                                        {prerequisites.map((prereq) => (
                                            <Card key={prereq.id}>
                                                <CardContent className={styles.prerequisiteCardContent}>
                                                    <div className={styles.prerequisiteItem}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className={styles.checkButton}
                                                            onClick={() => handleTogglePrerequisite(prereq.id)}
                                                            disabled={isReleased}
                                                        >
                                                            <CheckCircle2
                                                                className={`${styles.checkIcon} ${prereq.stage === 'DONE' ? styles.iconSuccess : styles.iconMuted}`}
                                                            />
                                                        </Button>
                                                        <div className={styles.prerequisiteContent}>
                                                            <div className={styles.categoryBadgeContainer}>
                                                                <Badge variant="outline" className={styles.categoryBadge}>
                                                                    {categoryLabels[prereq.category]}
                                                                </Badge>
                                                            </div>
                                                            <p className={styles.prerequisiteDescription}>{prereq.title}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {!isReleased && (
                                    <Card className={styles.addPrerequisiteCard}>
                                        <CardContent className={styles.addPrerequisiteContent}>
                                            <Label className={styles.addPrerequisiteLabel}>Add Prerequisite</Label>
                                            <Select value={newPrereqCategory} onValueChange={(v) => setNewPrereqCategory(v as PrerequisiteCategory)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ENV_VAR">Environment Variable</SelectItem>
                                                    <SelectItem value="MIGRATION">Migration</SelectItem>
                                                    <SelectItem value="INFRA">Infrastructure</SelectItem>
                                                    <SelectItem value="PERMISSIONS">Permissions</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                placeholder="Prerequisite description"
                                                value={newPrereqDesc}
                                                onChange={(e) => setNewPrereqDesc(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddPrerequisite()}
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddPrerequisite}
                                                className={styles.addButton}
                                            >
                                                <Plus className={styles.addIcon} />
                                                Add Prerequisite
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            <div className={styles.footer}>
                                <Button variant="outline" onClick={onClose} className={styles.footerButton}>
                                    {isReleased ? 'Close' : 'Cancel'}
                                </Button>
                                {!isReleased && (
                                    <Button onClick={handleSave} className={styles.footerButton}>
                                        Save Changes
                                    </Button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};
