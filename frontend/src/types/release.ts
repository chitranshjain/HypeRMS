export interface Product {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
}

export type ReleaseStage = 'PLANNED' | 'RELEASED';
export type ItemStage = 'DEV' | 'PRE_PROD' | 'RELEASED';
export type ItemType = 'BUG_FIX' | 'FEATURE';
export type PrerequisiteCategory = 'ENV_VAR' | 'MIGRATION' | 'INFRA' | 'PERMISSIONS';
export type PrerequisiteStage = 'PENDING' | 'DONE';

export interface Prerequisite {
    id: string;
    category: PrerequisiteCategory;
    title: string;
    stage: PrerequisiteStage;
}

export interface ReleaseItem {
    id: string;
    title: string;
    description: string;
    type: ItemType;
    stage: ItemStage;
    jiraLink?: string;
    docLink?: string;
    prerequisites: Prerequisite[];
}

export interface Release {
    id: string;
    productId: string;
    name: string;
    stage: ReleaseStage;
    targetDate: Date;
    items: ReleaseItem[];
    createdAt: Date;
}
