import { create } from 'zustand';
import { Product, Release, ReleaseItem } from '@/types/release';

interface StoreState {
    products: Product[];
    releases: Release[];
    addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
    addRelease: (release: Omit<Release, 'id' | 'createdAt' | 'items'>) => void;
    addReleaseItem: (releaseId: string, item: Omit<ReleaseItem, 'id' | 'prerequisites'>) => void;
    updateReleaseItem: (releaseId: string, itemId: string, updates: Partial<ReleaseItem>) => void;
    updateRelease: (releaseId: string, updates: Partial<Release>) => void;
}

export const useStore = create<StoreState>((set) => ({
    products: [],
    releases: [],

    addProduct: (product) =>
        set((state) => ({
            products: [
                ...state.products,
                {
                    ...product,
                    id: `PRD-${Date.now()}`,
                    createdAt: new Date(),
                },
            ],
        })),

    addRelease: (release) =>
        set((state) => ({
            releases: [
                ...state.releases,
                {
                    ...release,
                    id: `REL-${Date.now()}`,
                    items: [],
                    createdAt: new Date(),
                },
            ],
        })),

    addReleaseItem: (releaseId, item) =>
        set((state) => ({
            releases: state.releases.map((release) =>
                release.id === releaseId
                    ? {
                        ...release,
                        items: [
                            ...release.items,
                            {
                                ...item,
                                id: `ITEM-${Date.now()}`,
                                prerequisites: [],
                            },
                        ],
                    }
                    : release
            ),
        })),

    updateReleaseItem: (releaseId, itemId, updates) =>
        set((state) => ({
            releases: state.releases.map((release) =>
                release.id === releaseId
                    ? {
                        ...release,
                        items: release.items.map((item) =>
                            item.id === itemId ? { ...item, ...updates } : item
                        ),
                    }
                    : release
            ),
        })),

    updateRelease: (releaseId, updates) =>
        set((state) => ({
            releases: state.releases.map((release) =>
                release.id === releaseId ? { ...release, ...updates } : release
            ),
        })),
}));
