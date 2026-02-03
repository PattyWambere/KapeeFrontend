import React, { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    uploadAvatar: (file: File) => Promise<string>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await client.get("/auth/profile");
                setUser(response.data);
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<User | null> => {
        try {
            const response = await client.post("/auth/login", { email, password });
            const { token } = response.data;

            localStorage.setItem("token", token);

            // Fetch user profile immediately after login
            const profileResponse = await client.get("/auth/profile");
            const userData = profileResponse.data;
            setUser(userData);

            return userData;
        } catch (error) {
            console.error("Login failed:", error);
            return null;
        }
    };

    const register = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
        try {
            await client.post("/auth/register", {
                firstName,
                lastName,
                email,
                password
            });

            // Auto-login logic can be here, or just return true to let user login
            // For now, let's return true and require login (or we can auto-login if backend returns token)
            // Backend currently just says "User registered successfully"
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
        try {
            await client.post("/auth/change-password", { oldPassword, newPassword });
        } catch (error) {
            console.error("Change password failed:", error);
            throw error;
        }
    };

    const uploadAvatar = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await client.post("/users/upload-avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const newAvatar = response.data.avatar;
            if (user) {
                setUser({ ...user, avatar: newAvatar });
            }
            return newAvatar;
        } catch (error) {
            console.error("Upload avatar failed:", error);
            throw error;
        }
    };

    const forgotPassword = async (email: string): Promise<void> => {
        try {
            await client.post("/auth/forgot-password", { email });
        } catch (error) {
            console.error("Forgot password failed:", error);
            throw error;
        }
    };

    const resetPassword = async (token: string, password: string): Promise<void> => {
        try {
            await client.post(`/auth/reset-password/${token}`, { password });
        } catch (error) {
            console.error("Reset password failed:", error);
            throw error;
        }
    };

    const logout = () => {
        client.post("/auth/logout").catch(console.error); // Optional: notify backend
        localStorage.removeItem("token");
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, changePassword, uploadAvatar, forgotPassword, resetPassword, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
