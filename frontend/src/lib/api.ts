import {
    ApiProduct,
    ApiRelease,
    ApiReleaseItem,
    ApiPrerequisite,
    CreateProductRequest,
    CreateReleaseRequest,
    UpdateReleaseStatusRequest,
    CreateReleaseItemRequest,
    UpdateReleaseItemRequest,
    UpdateReleaseItemStatusRequest,
    AddPrerequisiteRequest,
    UpdatePrerequisiteStatusRequest,
    GetReleasesResponse
} from "../types/api";
import {
    Product,
    Release,
    ReleaseItem,
    Prerequisite,
    ReleaseStage,
    ItemStage,
    ItemType,
    PrerequisiteCategory,
    PrerequisiteStage
} from "../types/release";

const BASE_URL = "http://localhost:3000";

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.error || "An error occurred");
    }

    return response.json();
}

// Mappers
function mapProduct(apiProduct: ApiProduct): Product {
    return {
        id: apiProduct.id,
        name: apiProduct.name,
        createdAt: new Date(apiProduct.created_at),
    };
}

function mapRelease(apiRelease: ApiRelease): Release {
    console.log('DEBUG apiRelease', apiRelease);
    return {
        id: apiRelease.id,
        productId: apiRelease.product_id,
        name: apiRelease.name,
        stage: apiRelease.status as ReleaseStage,
        targetDate: new Date(apiRelease.target_date),
        items: [], // Items are usually fetched separately or need to be mapped if included
        createdAt: new Date(apiRelease.created_at),
    };
}

function mapPrerequisite(apiPrerequisite: ApiPrerequisite): Prerequisite {
    return {
        id: apiPrerequisite.id,
        category: apiPrerequisite.category as PrerequisiteCategory,
        title: apiPrerequisite.title,
        stage: apiPrerequisite.status as PrerequisiteStage,
    };
}

function mapReleaseItem(apiItem: ApiReleaseItem): ReleaseItem {
    return {
        id: apiItem.id,
        title: apiItem.title,
        description: apiItem.description,
        type: apiItem.type as ItemType,
        stage: apiItem.status as ItemStage,
        jiraLink: apiItem.jira_link,
        docLink: apiItem.doc_link,
        prerequisites: (apiItem.prerequisites || []).map(mapPrerequisite),
    };
}

// API Methods

export const api = {
    // Products
    getProducts: async (): Promise<Product[]> => {
        const data = await fetchJson<ApiProduct[]>("/products");
        return data.map(mapProduct);
    },

    createProduct: async (data: CreateProductRequest): Promise<Product> => {
        const res = await fetchJson<ApiProduct>("/products", {
            method: "POST",
            body: JSON.stringify(data),
        });
        return mapProduct(res);
    },

    // Releases
    getReleases: async (productId: string): Promise<{ upcoming: Release[]; historical: Release[] }> => {
        const data = await fetchJson<GetReleasesResponse>(`/products/${productId}/releases`);
        return {
            upcoming: data.upcoming.map(mapRelease),
            historical: data.historical.map(mapRelease),
        };
    },

    getRelease: async (releaseId: string): Promise<Release> => {
        // Note: This endpoint is not explicitly in the docs but implied by status update endpoint
        // If it doesn't exist, we might need to fetch from product releases list
        const data = await fetchJson<ApiRelease>(`/releases/${releaseId}`);
        return mapRelease(data);
    },

    // Release Items
    getReleaseItems: async (releaseId: string): Promise<ReleaseItem[]> => {
        const data = await fetchJson<ApiReleaseItem[]>(`/releases/${releaseId}/items`);
        return data.map(mapReleaseItem);
    },

    getReleaseItem: async (itemId: string): Promise<ReleaseItem> => {
        const data = await fetchJson<ApiReleaseItem>(`/items/${itemId}`);
        return mapReleaseItem(data);
    },

    createRelease: async (productId: string, data: CreateReleaseRequest): Promise<Release> => {
        const res = await fetchJson<ApiRelease>(`/products/${productId}/releases`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return mapRelease(res);
    },

    updateReleaseStatus: async (releaseId: string, data: UpdateReleaseStatusRequest): Promise<Release> => {
        const res = await fetchJson<ApiRelease>(`/releases/${releaseId}/status`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        return mapRelease(res);
    },

    // Release Items
    createReleaseItem: async (releaseId: string, data: CreateReleaseItemRequest): Promise<ReleaseItem> => {
        const res = await fetchJson<ApiReleaseItem>(`/releases/${releaseId}/items`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return mapReleaseItem(res);
    },

    updateReleaseItem: async (itemId: string, data: UpdateReleaseItemRequest): Promise<ReleaseItem> => {
        const res = await fetchJson<ApiReleaseItem>(`/items/${itemId}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        return mapReleaseItem(res);
    },

    updateReleaseItemStatus: async (itemId: string, data: UpdateReleaseItemStatusRequest): Promise<ReleaseItem> => {
        const res = await fetchJson<ApiReleaseItem>(`/items/${itemId}/status`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        return mapReleaseItem(res);
    },

    // Prerequisites
    addPrerequisite: async (itemId: string, data: AddPrerequisiteRequest): Promise<Prerequisite> => {
        const res = await fetchJson<ApiPrerequisite>(`/items/${itemId}/prerequisites`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return mapPrerequisite(res);
    },

    updatePrerequisiteStatus: async (prerequisiteId: string, data: UpdatePrerequisiteStatusRequest): Promise<Prerequisite> => {
        const res = await fetchJson<ApiPrerequisite>(`/prerequisites/${prerequisiteId}/status`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        return mapPrerequisite(res);
    },
};
