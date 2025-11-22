import { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useCreateProduct } from '@/hooks/use-products';
import { toast } from 'sonner';

import styles from './CreateProductDialog.module.scss';

export const CreateProductDialog = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    const { mutate: createProduct, isPending } = useCreateProduct();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Product name is required');
            return;
        }

        createProduct({ name }, {
            onSuccess: () => {
                toast.success('Product created successfully');
                setName('');
                setOpen(false);
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to create product');
            }
        });
    };
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button className={styles.triggerButton}>
                <Plus className={styles.icon} />
                New Product
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>Add a new product to track releases</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <div className={styles.formContainer}>
                    <div className={styles.inputGroup}>
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" placeholder="Enter product name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Creating...' : 'Create Product'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>;
};