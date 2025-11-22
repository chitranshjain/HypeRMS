import { useProducts } from '@/hooks/use-products';
import { ProductCard } from '@/components/ProductCard';
import { CreateProductDialog } from '@/components/CreateProductDialog';
import { Package, Loader2 } from 'lucide-react';

import styles from './ProductsPage.module.scss';

const ProductsPage = () => {
    const { data: products, isLoading } = useProducts();

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loader} />
            </div>
        );
    }

    const productList = products || [];
    return <div className={styles.pageContainer}>
        <div className={styles.contentContainer}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Products</h1>
                    <p className={styles.subtitle}>Manage your products and releases</p>
                </div>
                <CreateProductDialog />
            </div>

            {productList.length === 0 ? <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                    <Package className={styles.emptyIcon} />
                </div>
                <h3 className={styles.emptyTitle}>No products yet</h3>
                <p className={styles.emptyDescription}>Create your first product to start tracking releases</p>
                <CreateProductDialog />
            </div> : <div className={styles.grid}>
                {productList.map(product => <ProductCard key={product.id} product={product} />)}
            </div>}
        </div>
    </div>;
};
export default ProductsPage;