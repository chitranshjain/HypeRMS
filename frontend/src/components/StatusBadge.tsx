import { Badge } from '@/components/ui/badge';
import { ReleaseStage, ItemStage, PrerequisiteStage } from '@/types/release';

interface StatusBadgeProps {
    status: ReleaseStage | ItemStage | PrerequisiteStage;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'info' | 'secondary'> = {
        'PLANNED': 'info',
        'DEV': 'warning',
        'PRE_PROD': 'warning',
        'RELEASED': 'success',
        'PENDING': 'secondary',
        'DONE': 'success',
    };

    const labels: Record<string, string> = {
        'PLANNED': 'Planned',
        'DEV': 'In Development',
        'PRE_PROD': 'Pre-Production',
        'RELEASED': 'Released',
        'PENDING': 'Pending',
        'DONE': 'Done',
    };

    return (
        <Badge variant={variants[status]}>
            {labels[status]}
        </Badge>
    );
};
