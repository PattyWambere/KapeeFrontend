import client from "./client";

export interface Settings {
    _id: string;
    freeShippingThreshold: number;
}

const settingsService = {
    /**
     * Get global settings
     */
    getSettings: async (): Promise<Settings> => {
        const response = await client.get("/settings");
        return response.data;
    },

    /**
     * Update global settings
     */
    updateSettings: async (data: { freeShippingThreshold: number }): Promise<Settings> => {
        const response = await client.put("/settings", data);
        return response.data;
    }
};

export default settingsService;
