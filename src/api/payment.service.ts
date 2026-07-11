import client from "./client";

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface PaymentMethodsResponse {
  paymentMethods: PaymentMethod[];
  defaultPaymentMethodId: string | null;
}

const paymentService = {
  createSetupIntent: async () => {
    const response = await client.post("/payments/setup-intent");
    return response.data as { clientSecret: string };
  },

  getPaymentMethods: async () => {
    const response = await client.get("/payments/payment-methods");
    return response.data as PaymentMethodsResponse;
  },

  deletePaymentMethod: async (id: string) => {
    const response = await client.delete(`/payments/payment-methods/${id}`);
    return response.data;
  },

  setDefaultPaymentMethod: async (id: string) => {
    const response = await client.put(`/payments/payment-methods/${id}/default`);
    return response.data;
  },
};

export default paymentService;
