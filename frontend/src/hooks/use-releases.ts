import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateReleaseRequest, UpdateReleaseStatusRequest } from "@/types/api";

export const useReleases = (productId: string) => {
    return useQuery({
        queryKey: ["releases", productId],
        queryFn: () => api.getReleases(productId),
        enabled: !!productId,
    });
};

export const useRelease = (releaseId: string) => {
    return useQuery({
        queryKey: ["release", releaseId],
        queryFn: () => api.getRelease(releaseId),
        enabled: !!releaseId,
    });
};

export const useCreateRelease = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, data }: { productId: string; data: CreateReleaseRequest }) =>
            api.createRelease(productId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["releases", variables.productId] });
        },
    });
};

export const useUpdateReleaseStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ releaseId, data }: { releaseId: string; data: UpdateReleaseStatusRequest }) =>
            api.updateReleaseStatus(releaseId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["releases", data.productId] });
        },
    });
};
