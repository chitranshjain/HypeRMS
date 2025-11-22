import { ItemStage, ItemType, PrerequisiteCategory, PrerequisiteStage, ReleaseStage } from "./release";

export interface ApiProduct {
    id: string;
    name: string;
    created_at: string;
}

export interface ApiRelease {
    id: string;
    product_id: string;
    target_date: string;
    status: string; // "PLANNED" | "RELEASED"
    created_at: string;
    name: string;
}

export interface GetReleasesResponse {
    upcoming: ApiRelease[];
    historical: ApiRelease[];
}

export interface ApiPrerequisite {
    id: string;
    release_item_id: string;
    title: string;
    category: string; // PrerequisiteCategory
    status: string; // "PENDING" | "DONE"
    created_at: string;
}

export interface ApiReleaseItem {
    id: string;
    release_id: string;
    title: string;
    description: string;
    type: string; // ItemType
    jira_link: string;
    doc_link: string;
    status: string; // "DEV" | "PRE_PROD" | "RELEASED"
    created_at: string;
    prerequisites?: ApiPrerequisite[];
}

export interface CreateProductRequest {
    name: string;
}

export interface CreateReleaseRequest {
    targetDate: string;
    name: string;
}

export interface UpdateReleaseStatusRequest {
    status: string;
}

export interface CreateReleaseItemRequest {
    title: string;
    description?: string;
    type: string;
    jiraLink?: string;
    docLink?: string;
    prerequisites?: {
        title: string;
        category: string;
    }[];
}

export interface UpdateReleaseItemRequest {
    title?: string;
    description?: string;
    type?: string;
    jiraLink?: string;
    docLink?: string;
}

export interface UpdateReleaseItemStatusRequest {
    status: string;
}

export interface AddPrerequisiteRequest {
    title: string;
    category: string;
}

export interface UpdatePrerequisiteStatusRequest {
    status: string;
}
