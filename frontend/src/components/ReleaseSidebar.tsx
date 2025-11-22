import { Release } from '@/types/release';
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StatusBadge } from './StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, ExternalLink, FileText, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import styles from './ReleaseSidebar.module.scss';

interface ReleaseSidebarProps {
    release: Release;
}

export const ReleaseSidebar = ({ release }: ReleaseSidebarProps) => {
    const releasedItems = release.items.filter(item => item.stage === 'RELEASED').length;
    const totalItems = release.items.length;
    const progress = totalItems > 0 ? (releasedItems / totalItems) * 100 : 0;

    const categoryLabels: Record<string, string> = {
        'ENV_VAR': 'Environment Variable',
        'MIGRATION': 'Migration',
        'INFRA': 'Infrastructure',
        'PERMISSIONS': 'Permissions',
    };

    return (
        <Sidebar side="right" className={styles.sidebar} style={{ "--sidebar-width": "20rem" } as React.CSSProperties}>
            <SidebarHeader className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.titleContainer}>
                        <Package2 className={styles.icon} />
                        <h2 className={styles.title}>{release.name}</h2>
                    </div>
                    <SidebarTrigger />
                </div>

                <div className={styles.statusSection}>
                    <div className={styles.statusRow}>
                        <span className={styles.label}>Status</span>
                        <StatusBadge status={release.stage} />
                    </div>

                    <div className={styles.statusRow}>
                        <span className={styles.label}>Target Date</span>
                        <div className={styles.dateContainer}>
                            <Calendar className={styles.dateIcon} />
                            <span>{format(release.targetDate, 'MMM dd, yyyy')}</span>
                        </div>
                    </div>

                    <div className={styles.progressContainer}>
                        <div className={styles.statusRow}>
                            <span className={styles.label}>Progress</span>
                            <span className={styles.progressValue}>{releasedItems}/{totalItems} items</span>
                        </div>
                        <Progress value={progress} className={styles.progressBar} />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className={styles.content}>
                <div className="space-y-2">
                    <h3 className={styles.sectionTitle}>
                        Release Items
                    </h3>

                    {release.items.length === 0 ? (
                        <p className={styles.emptyState}>No items yet</p>
                    ) : (
                        <Accordion type="single" collapsible className={styles.accordion}>
                            {release.items.map((item) => {
                                const allPrereqsDone = item.prerequisites.every(p => p.stage === 'DONE');
                                const pendingPrereqs = item.prerequisites.filter(p => p.stage === 'PENDING').length;

                                return (
                                    <AccordionItem
                                        key={item.id}
                                        value={item.id}
                                        className={styles.accordionItem}
                                    >
                                        <AccordionTrigger className={styles.accordionTrigger}>
                                            <div className={styles.triggerContent}>
                                                <div className={styles.triggerInfo}>
                                                    <div className={styles.triggerTitle}>{item.title}</div>
                                                    <div className={styles.triggerBadges}>
                                                        <Badge variant={item.type === 'FEATURE' ? 'default' : 'secondary'} className={styles.typeBadge}>
                                                            {item.type === 'FEATURE' ? 'Feature' : 'Bug Fix'}
                                                        </Badge>
                                                        <StatusBadge status={item.stage} />
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent className={styles.accordionContent}>
                                            <div className={styles.itemDescription}>
                                                {item.description}
                                            </div>

                                            {(item.jiraLink || item.docLink) && (
                                                <div className={styles.linksContainer}>
                                                    {item.jiraLink && (
                                                        <a href={item.jiraLink} target="_blank" rel="noopener noreferrer">
                                                            <Button variant="outline" size="sm" className={styles.linkButton}>
                                                                <ExternalLink className={styles.linkIcon} />
                                                                Jira
                                                            </Button>
                                                        </a>
                                                    )}
                                                    {item.docLink && (
                                                        <a href={item.docLink} target="_blank" rel="noopener noreferrer">
                                                            <Button variant="outline" size="sm" className={styles.linkButton}>
                                                                <FileText className={styles.linkIcon} />
                                                                Docs
                                                            </Button>
                                                        </a>
                                                    )}
                                                </div>
                                            )}

                                            {item.prerequisites.length > 0 && (
                                                <div className={styles.prerequisitesSection}>
                                                    <div className={styles.prerequisitesHeader}>
                                                        <span className={styles.prerequisitesLabel}>Prerequisites</span>
                                                        {allPrereqsDone ? (
                                                            <Badge variant="success" className={styles.prerequisitesBadge}>
                                                                All Done
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="warning" className={styles.prerequisitesBadge}>
                                                                {pendingPrereqs} Pending
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className={styles.prerequisitesList}>
                                                        {item.prerequisites.map((prereq) => (
                                                            <div
                                                                key={prereq.id}
                                                                className={styles.prerequisiteItem}
                                                            >
                                                                <CheckCircle2
                                                                    className={`${styles.prerequisiteIcon} ${prereq.stage === 'DONE' ? styles.iconSuccess : styles.iconMuted}`}
                                                                />
                                                                <div className={styles.prerequisiteContent}>
                                                                    <Badge variant="outline" className={styles.categoryBadge}>
                                                                        {categoryLabels[prereq.category]}
                                                                    </Badge>
                                                                    <p className={styles.prerequisiteDescription}>{prereq.title}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    )}
                </div>
            </SidebarContent>
        </Sidebar>
    );
};
