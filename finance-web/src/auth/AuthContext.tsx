/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState } from "react";
import api from "../api/api";
import type { RegisterUser, UpdateEmail, UpdateName, UpdatePassword, UpdateUsername, UserInfo } from "../models/User";
import { analytics } from "../analytics/analytics";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string, userData: UserInfo) => void;
  user: UserInfo | null,
  logout: () => void;
  register: (registerUser: RegisterUser) => Promise<{ success: boolean; errors?: any }>;
  nameUpdate: (name: UpdateName, id: string) => void;
  passwordUpdate: (password: UpdatePassword, id: string) => void;
  emailUpdate: (email: UpdateEmail, id: string) => void;
  usernameUpdate: (username: UpdateUsername, id: string) => void;
  deleteAccount: (id: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [user, setUser] = useState<UserInfo | null>(JSON.parse(localStorage.getItem("userInfo") || "null"));

    const login = (token: string, userInfo: UserInfo) => {
        try{            
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            analytics.login();
            localStorage.setItem("token", token);   
            setUser(userInfo)         
            setIsAuthenticated(true);
        }catch(err){
            analytics.apiError("Login: " + (err as Error).message);
        }        
    }

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
    }

    const register = async (user: RegisterUser) => {
        try{
            await api.post("/Auth/register", user);
            return { success: true };
        }catch(err : any){
            console.error(err);
            analytics.apiError("Register: " + (err as Error).message);
            return { success: false, errors: err.response?.data?.errors, };
        }
    }

    const nameUpdate = async(name: UpdateName, id: string) => {
        try{
            const response = await api.put(`/Auth/updateName/${id}`, name);
            localStorage.setItem("userInfo", JSON.stringify(response.data as UserInfo))
            setUser(response.data as UserInfo);
            return response.data;
        }catch(err){            
            analytics.apiError("Name Update: " + (err as Error).message);
            console.error(err);
        }
    }

    const passwordUpdate = async(password: UpdatePassword, id: string) => {
        try{
            const response = await api.put(`/Auth/updatePassword/${id}`, password);
            setUser(response.data as UserInfo);
            return response.data;
        }catch(err){
            analytics.apiError("Password Update: " + (err as Error).message);
            console.error(err);
        }
    }

    const emailUpdate = async(email: UpdateEmail, id: string) => {
        try{
            const response = await api.put(`/Auth/updateEmail/${id}`, email);
            localStorage.setItem("userInfo", JSON.stringify(response.data as UserInfo))
            setUser(response.data as UserInfo);
            return response.data;
        }catch(err){
            analytics.apiError("Email Update: " + (err as Error).message);
            console.error(err);
        }
    }

    const usernameUpdate = async(username: UpdateUsername, id: string) => {
        try{
            const response = await api.put(`/Auth/updateUsername/${id}`, username);
            localStorage.setItem("userInfo", JSON.stringify(response.data as UserInfo))
            setUser(response.data as UserInfo);
            return response.data;
        }catch(err){
            analytics.apiError("Username Update: " + (err as Error).message);
            console.error(err);
        }
    }


    const deleteAccount = async(id: string) => {
        try{
            await api.delete(`/Auth/delete/${id}`);
            logout();
        }catch(err){
            analytics.apiError("Delete Account: " + (err as Error).message);
            console.error(err);
        }
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, nameUpdate, passwordUpdate, emailUpdate, usernameUpdate, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    };
    return context;
}