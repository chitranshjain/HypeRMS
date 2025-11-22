import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
    CreateReleaseItemRequest,
    UpdateReleaseItemRequest,
    UpdateReleaseItemStatusRequest,
    AddPrerequisiteRequest,
    UpdatePrerequisiteStatusRequest
} from "@/types/api";

export const useReleaseItems = (releaseId: string) => {
    return useQuery({
        queryKey: ["release-items", releaseId],
        queryFn: () => api.getReleaseItems(releaseId),
        enabled: !!releaseId,
    });
};

export const useReleaseItem = (itemId: string) => {
    return useQuery({
        queryKey: ["release-item", itemId],
        queryFn: () => api.getReleaseItem(itemId),
        enabled: !!itemId,
    });
};

export const useCreateReleaseItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ releaseId, data }: { releaseId: string; data: CreateReleaseItemRequest }) =>
            api.createReleaseItem(releaseId, data),
        onSuccess: (_, variables) => {
            // Invalidate release-items query for this specific release
            queryClient.invalidateQueries({ queryKey: ["release-items", variables.releaseId] });
            // Also invalidate releases to update item counts
            queryClient.invalidateQueries({ queryKey: ["releases"] });
        },
    });
};

export const useUpdateReleaseItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, data }: { itemId: string; data: UpdateReleaseItemRequest }) =>
            api.updateReleaseItem(itemId, data),
        onSuccess: (data) => {
            // Invalidate release-items queries to reflect the update
            queryClient.invalidateQueries({ queryKey: ["release-items"] });
            queryClient.invalidateQueries({ queryKey: ["releases"] });
        },
    });
};

export const useUpdateReleaseItemStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, data }: { itemId: string; data: UpdateReleaseItemStatusRequest }) =>
            api.updateReleaseItemStatus(itemId, data),
        onSuccess: (data) => {
            // Invalidate release-items queries to reflect status change
            queryClient.invalidateQueries({ queryKey: ["release-items"] });
            queryClient.invalidateQueries({ queryKey: ["releases"] });
        },
    });
};

export const useAddPrerequisite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, data }: { itemId: string; data: AddPrerequisiteRequest }) =>
            api.addPrerequisite(itemId, data),
        onSuccess: () => {
            // Invalidate release-items queries to show new prerequisite
            queryClient.invalidateQueries({ queryKey: ["release-items"] });
            queryClient.invalidateQueries({ queryKey: ["releases"] });
        },
    });
};

export const useUpdatePrerequisiteStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ prerequisiteId, data }: { prerequisiteId: string; data: UpdatePrerequisiteStatusRequest }) =>
            api.updatePrerequisiteStatus(prerequisiteId, data),
        onSuccess: () => {
            // Invalidate release-items queries to reflect prerequisite status change
            queryClient.invalidateQueries({ queryKey: ["release-items"] });
            queryClient.invalidateQueries({ queryKey: ["releases"] });
        },
    });
};
