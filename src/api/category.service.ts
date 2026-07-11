import client from "./client";

export interface Category {
    id: string;
    name: string;
    description?: string;
}

const categoryService = {
    /**
     * Get all categories
     */
    getCategories: async (): Promise<Category[]> => {
        const response = await client.get("/categories/categories");
        return response.data;
    },

    /**
     * Get a single category by its ID
     */
    getCategoryById: async (id: string): Promise<Category> => {
        const response = await client.get(`/categories/categoriesById/${id}`);
        return response.data;
    },

    createCategory: async (data: Partial<Category>): Promise<Category> => {
        const response = await client.post("/categories/createCategory", data);
        return response.data;
    },

    updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
        const response = await client.put(`/categories/updateCategory/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: string): Promise<void> => {
        await client.delete(`/categories/deleteCategory/${id}`);
    }
};

export default categoryService;
