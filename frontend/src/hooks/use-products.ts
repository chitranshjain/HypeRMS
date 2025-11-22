import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateProductRequest } from "@/types/api";

export const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: api.getProducts,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProductRequest) => api.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};
