import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { Product } from '@/types/release';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
    product: Product;
}
export const ProductCard = ({
    product
}: ProductCardProps) => {
    return <Link to={`/products/${product.id}`}>
        <Card className={styles.card}>
            <CardHeader>
                <div className={styles.headerContent}>
                    <div className={styles.titleContainer}>
                        <div className={styles.iconWrapper}>
                            <Package className={styles.icon} />
                        </div>
                        <div>
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription className={styles.description}>{product.id}</CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            {product.description && <CardContent>
                <p className={styles.contentDescription}>{product.description}</p>
            </CardContent>}
        </Card>
    </Link>;
};