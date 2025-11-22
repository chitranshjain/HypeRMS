import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useReleases, useUpdateReleaseStatus, useRelease } from '@/hooks/use-releases';
import { useProducts } from '@/hooks/use-products';
import { useReleaseItems } from '@/hooks/use-release-items';
import { ReleaseItemCard } from '@/components/ReleaseItemCard';
import { CreateReleaseItemDialog } from '@/components/CreateReleaseItemDialog';
import { EditItemSheet } from '@/components/EditItemSheet';
import { ReleaseSidebar } from '@/components/ReleaseSidebar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ArrowLeft, Loader2, PanelRightOpen, ListTodo } from 'lucide-react';
import { ReleaseItem } from '@/types/release';
import { format } from 'date-fns';
import { toast } from 'sonner';

import styles from './ReleaseDetailPage.module.scss';

const ReleaseDetailPage = () => {
    const { releaseId } = useParams<{ releaseId: string }>();
    const { data: items, isLoading: isLoadingItems } = useReleaseItems(releaseId || '');
    const { data: releaseData, isLoading: isLoadingRelease } = useRelease(releaseId || '');
    const { data: products } = useProducts();
    const { mutateAsync: updateReleaseStatus } = useUpdateReleaseStatus();
    const [editingItem, setEditingItem] = useState<string | null>(null);

    const releaseItems = items || [];
    const release = releaseData;

    // Find the correct product using the product_id from the release
    const product = products?.find(p => p.id === release?.productId);

    const allItemsReleased = releaseItems.every(item => item.stage === 'RELEASED');
    const canMarkAsReleased = release?.stage === 'PLANNED' && allItemsReleased && releaseItems.length > 0;

    const handleMarkAsReleased = async () => {
        if (!releaseId || !canMarkAsReleased) return;

        try {
            await updateReleaseStatus({
                releaseId,
                data: { status: 'RELEASED' }
            });
            toast.success('Release marked as released!');
        } catch (error) {
            toast.error('Failed to mark release as released');
        }
    };

    if (isLoadingItems || isLoadingRelease) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loader} />
            </div>
        );
    }

    if (!releaseId) {
        return (
            <div className={styles.notFoundContainer}>
                <div className={styles.notFoundContent}>
                    <h2 className={styles.notFoundTitle}>Release not found</h2>
                    <Link to="/">
                        <Button variant="outline" className={styles.backButton}>
                            <ArrowLeft className={styles.backIcon} />
                            Back to Products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className={styles.pageLayout}>
                <div className={styles.mainContent}>
                    <div className={styles.container}>
                        <div className={styles.backLinkWrapper}>
                            <Link to={`/products/${product?.id}`}>
                                <Button variant="ghost" className={styles.backButtonGhost}>
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to {product?.name}
                                </Button>
                            </Link>
                        </div>

                        <div className={styles.header}>
                            <div>
                                <div className={styles.titleSection}>
                                    <h1 className={styles.title}>{release?.name}</h1>
                                    <StatusBadge status={release?.stage} />
                                </div>
                                <p className={styles.description}>
                                    Target: {format(release?.targetDate, 'MMMM dd, yyyy')} • {releaseItems.length} items
                                </p>
                            </div>
                            <div className={styles.actions}>
                                {release?.stage !== 'RELEASED' && <CreateReleaseItemDialog releaseId={release?.id} />}
                                {release?.stage === 'PLANNED' && (
                                    <Button
                                        onClick={handleMarkAsReleased}
                                        disabled={!canMarkAsReleased}
                                        variant="default"
                                        title={!canMarkAsReleased ? 'All items must be released before marking the release as released' : ''}
                                    >
                                        Mark as Released
                                    </Button>
                                )}
                                <SidebarTrigger asChild>
                                    <Button variant='outline' size='2xl' className={styles.overviewButton}>
                                        <PanelRightOpen className="h-4 w-4" />
                                        Overview
                                    </Button>
                                </SidebarTrigger>
                            </div>
                        </div>

                        {releaseItems.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIconWrapper}>
                                    <ListTodo className={styles.emptyIcon} />
                                </div>
                                <h3 className={styles.emptyTitle}>No items yet</h3>
                                <p className={styles.emptyDescription}>Add your first item to this release</p>
                                <CreateReleaseItemDialog releaseId={release?.id} />
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {releaseItems.map((item) => (
                                    <ReleaseItemCard
                                        key={item.id}
                                        item={item}
                                        onEdit={() => setEditingItem(item.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {editingItem && (
                        <EditItemSheet
                            releaseId={releaseId || ''}
                            itemId={editingItem}
                            open={!!editingItem}
                            onClose={() => setEditingItem(null)}
                        />
                    )}
                </div>

                <ReleaseSidebar release={{ ...release, items: releaseItems }} />
            </div>
        </SidebarProvider>
    );
};

export default ReleaseDetailPage;
