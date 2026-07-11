import client from "./client";

export interface OrderItem {
    productId: string | { _id: string; name: string; images: string[]; price: number };
    quantity: number;
    price: number;
}

export interface Order {
    id: string; // The UUID from backend
    _id?: string; // MongoDB ID if needed
    customerId: string;
    items: OrderItem[];
    totalAmount: number;
    status: "pending" | "shipped" | "delivered" | "cancelled";
    paymentMethod?: "card" | "cod";
    paymentStatus?: "pending" | "paid" | "failed";
    paymentDetails?: {
        cardType?: string;
        last4?: string;
        transactionId?: string;
    };
    createdAt: string;
    updatedAt: string;
}

const orderService = {
    /**
     * Create a new order from the current user's cart
     */
    createOrder: async (paymentMethod?: string, paymentDetails?: any): Promise<Order> => {
        const response = await client.post("/orders/createOrders", { paymentMethod, paymentDetails });
        return response.data;
    },

    /**
     * Create Stripe PaymentIntent
     */
    createPaymentIntent: async (data?: { paymentMethodId?: string }): Promise<{ clientSecret: string; totalAmount: number; fallback?: boolean; status?: string }> => {
        const response = await client.post("/orders/create-payment-intent", data || {});
        return response.data;
    },

    /**
     * Get all orders for the current user
     */
    getOrders: async (): Promise<Order[]> => {
        const response = await client.get("/orders/orders");
        return response.data;
    },

    /**
     * Get a single order by its ID
     */
    getOrderById: async (id: string): Promise<Order> => {
        const response = await client.get(`/orders/orders/${id}`);
        return response.data;
    },

    /**
     * Cancel a pending order
     */
    cancelOrder: async (id: string): Promise<Order> => {
        const response = await client.patch(`/orders/cancelOrders/${id}/cancel`);
        return response.data.order;
    },

    /**
     * Update order status (Admin only)
     */
    updateOrder: async (id: string, status: string): Promise<Order> => {
        const response = await client.put(`/orders/updateOrders/${id}`, { status });
        return response.data;
    },

    /**
     * Delete an order (Admin only)
     */
    deleteOrder: async (id: string): Promise<void> => {
        await client.delete(`/orders/deleteOrders/${id}`);
    }
};

export default orderService;
