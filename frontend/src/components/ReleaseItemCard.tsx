import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { ReleaseItem } from '@/types/release';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReleaseItemCardProps {
    item: ReleaseItem;
    onEdit: () => void;
}

import styles from './ReleaseItemCard.module.scss';

export const ReleaseItemCard = ({ item, onEdit }: ReleaseItemCardProps) => {
    const allPrerequisitesDone = item.prerequisites.every(p => p.stage === 'DONE');
    const donePrerequisites = item.prerequisites.filter(p => p.stage === 'DONE').length;
    const pendingPrerequisites = item.prerequisites.filter(p => p.stage === 'PENDING').length;

    return (
        <Card className={styles.card}>
            <CardHeader>
                <div className={styles.headerContent}>
                    <div className={styles.titleWrapper}>
                        <div className={styles.titleContainer}>
                            <CardTitle className={styles.cardTitle}>{item.title}</CardTitle>
                        </div>
                        <div className={styles.badgesContainer}>
                            <Badge variant={item.type === 'FEATURE' ? 'default' : 'secondary'}>
                                {item.type === 'FEATURE' ? 'Feature' : 'Bug Fix'}
                            </Badge>
                            <StatusBadge status={item.stage} />
                        </div>
                    </div>
                </div>
                <CardDescription className={styles.description}>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className={styles.contentContainer}>
                {(item.jiraLink || item.docLink) && (
                    <div className={styles.linksContainer}>
                        {item.jiraLink && (
                            <a href={item.jiraLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className={styles.linkButton}>
                                    <ExternalLink className={styles.icon} />
                                    Jira
                                </Button>
                            </a>
                        )}
                        {item.docLink && (
                            <a href={item.docLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className={styles.linkButton}>
                                    <FileText className={styles.icon} />
                                    Docs
                                </Button>
                            </a>
                        )}
                    </div>
                )}

                {item.prerequisites.length > 0 && (
                    <div className={styles.prerequisitesContainer}>
                        <div className={styles.prerequisitesHeader}>
                            <span className={styles.prerequisitesLabel}>Prerequisites</span>
                            <div className={styles.statusContainer}>
                                {allPrerequisitesDone ? (
                                    <>
                                        <CheckCircle2 className={`${styles.statusIcon} ${styles.statusSuccess}`} />
                                        <span className={styles.statusSuccess}>All done</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className={`${styles.statusIcon} ${styles.statusWarning}`} />
                                        <span className={styles.statusText}>{pendingPrerequisites} pending</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <Button variant="outline" size="sm" onClick={onEdit} className={styles.viewButton}>
                    {item.stage === 'RELEASED' ? 'View' : 'View Details'}
                </Button>
            </CardContent>
        </Card>
    );
};
