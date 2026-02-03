import client from "./client";

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    inStock: boolean;
    quantity: number;
    images: string[];
}

const productService = {
    /**
     * Get all products
     */
    getProducts: async (): Promise<Product[]> => {
        const response = await client.get("/products/products");
        return response.data;
    },

    /**
     * Get a single product by ID
     */
    getProductById: async (id: string): Promise<Product> => {
        const response = await client.get(`/products/productsById/${id}`);
        return response.data;
    },

    /**
     * Create a new product
     */
    createProduct: async (data: Partial<Product>): Promise<Product> => {
        const response = await client.post("/products/products", data);
        return response.data;
    },

    /**
     * Update an existing product
     */
    updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
        const response = await client.put(`/products/products/${id}`, data);
        return response.data;
    },

    /**
     * Delete a product
     */
    deleteProduct: async (id: string): Promise<void> => {
        await client.delete(`/products/products/${id}`);
    }
};

export default productService;
