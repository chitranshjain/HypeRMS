import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Release } from '@/types/release';
import { Calendar, Package2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface ReleaseCardProps {
    release: Release;
}

import styles from './ReleaseCard.module.scss';

export const ReleaseCard = ({ release }: ReleaseCardProps) => {
    const releasedItems = release.items.filter(item => item.stage === 'RELEASED').length;
    const totalItems = release.items.length;

    console.log('DEBUG', release);

    return (
        <Link to={`/releases/${release.id}`}>
            <Card className={styles.card}>
                <CardHeader>
                    <div className={styles.headerContent}>
                        <div className={styles.titleWrapper}>
                            <div className={styles.titleContainer}>
                                <Package2 className={styles.icon} />
                                <CardTitle>{release.name}</CardTitle>
                            </div>
                            <CardDescription>{release.id}</CardDescription>
                        </div>
                        <StatusBadge status={release.stage} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className={styles.footerContent}>
                        <div className={styles.dateWrapper}>
                            <Calendar className={styles.dateIcon} />
                            <span>Target: {format(release.targetDate, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className={styles.itemsCount}>
                            {releasedItems}/{totalItems} items
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
