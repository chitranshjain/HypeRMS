import { useParams, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/use-products';
import { useReleases } from '@/hooks/use-releases';
import { ReleaseCard } from '@/components/ReleaseCard';
import { CreateReleaseDialog } from '@/components/CreateReleaseDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Rocket, Loader2 } from 'lucide-react';

import styles from './ProductDetailPage.module.scss';

const ProductDetailPage = () => {
    const { productId } = useParams<{ productId: string }>();
    const { data: products, isLoading: isLoadingProducts } = useProducts();
    const { data: releasesData, isLoading: isLoadingReleases } = useReleases(productId || '');

    const product = products?.find((p) => p.id === productId);

    const upcomingReleases = releasesData?.upcoming || [];
    const historicalReleases = releasesData?.historical || [];

    if (isLoadingProducts || isLoadingReleases) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loader} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.notFoundContainer}>
                <div className={styles.notFoundContent}>
                    <h2 className={styles.notFoundTitle}>Product not found</h2>
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
        <div className={styles.pageContainer}>
            <div className={styles.contentContainer}>
                <div className={styles.backLinkWrapper}>
                    <Link to="/">
                        <Button variant="ghost" className={styles.backButtonGhost}>
                            <ArrowLeft className={styles.backIcon} />
                            Back to Products
                        </Button>
                    </Link>
                </div>

                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{product.name}</h1>
                        <p className={styles.description}>{product.description || product.id}</p>
                    </div>
                    <CreateReleaseDialog productId={product.id} />
                </div>

                {upcomingReleases.length === 0 && historicalReleases.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIconWrapper}>
                            <Rocket className={styles.emptyIcon} />
                        </div>
                        <h3 className={styles.emptyTitle}>No releases yet</h3>
                        <p className={styles.emptyDescription}>Create your first release to start tracking items</p>
                        <CreateReleaseDialog productId={product.id} />
                    </div>
                ) : (
                    <Tabs defaultValue="upcoming" className={styles.tabs}>
                        <TabsList>
                            <TabsTrigger value="upcoming">
                                Upcoming ({upcomingReleases.length})
                            </TabsTrigger>
                            <TabsTrigger value="historical">
                                Historical ({historicalReleases.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming" className={styles.tabsContent}>
                            {upcomingReleases.length === 0 ? (
                                <div className={styles.emptyTabState}>
                                    <p className={styles.emptyTabText}>No upcoming releases</p>
                                </div>
                            ) : (
                                <div className={styles.grid}>
                                    {upcomingReleases.map((release) => (
                                        <ReleaseCard key={release.id} release={release} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="historical" className={styles.tabsContent}>
                            {historicalReleases.length === 0 ? (
                                <div className={styles.emptyTabState}>
                                    <p className={styles.emptyTabText}>No historical releases</p>
                                </div>
                            ) : (
                                <div className={styles.grid}>
                                    {historicalReleases.map((release) => (
                                        <ReleaseCard key={release.id} release={release} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
