/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import type { CategoryDto, MinimalCategory, ReturnCategory } from "../models/Category"
import api, { getAuthHeader } from "../api/api";
import { useAuth } from "../auth/AuthContext";

type CategoryContextType = {
    categories: ReturnCategory[];
    setCategories: (c: ReturnCategory[]) => void;
    minCategories: MinimalCategory[];
    setMinCategories: (m: MinimalCategory[]) => void;
    getAll: () => Promise<ReturnCategory[]>;
    getAllMinimal: () => Promise<MinimalCategory[]>;
    getById: (id:string) => Promise<ReturnCategory>;
    createCategory: (createCategory: CategoryDto) => Promise<ReturnCategory | null>;
    addToCategory: (id:string, addTransaction:string[]) => Promise<ReturnCategory | null>;
    removeOfCategory: (id:string, removeTransaction:string[]) => Promise<ReturnCategory | null>;
    updateCategory: (id:string, updateCategory: CategoryDto) => Promise<ReturnCategory | null>;
    deleteCategory: (id:string) => void;
    categoryClearCache: () => void;  
}

const CategoryContext = createContext<CategoryContextType | null>(null);

export function CategoryProvider({children}:{children: React.ReactNode}){
    const [categories, setCategories] = useState<ReturnCategory[]>([]);
    const [minCategories, setMinCategories] = useState<MinimalCategory[]>([]);

    const { isAuthenticated } = useAuth();

    const getAll = async() => {
        try{
            const res = await api.get("/Category", {headers: getAuthHeader()});
            return res.data
        }catch(err){
            console.error(err)
        }
    }

    const getAllMinimal = async() => {
        try{
            const res = await api.get("/Category/minimal", {headers: getAuthHeader()});
            return res.data
        }catch(err){
            console.error(err)
        }
    }

    const getById = async(id:string) => {
        try{
            const res = await api.get(`/Category/${id}`, {headers: getAuthHeader()});
            return res.data
        }catch(err){
            console.error(err)
        }
    }

    const createCategory = async(createCategory: CategoryDto): Promise<ReturnCategory | null> => {
        try{
            const res = await api.post<CategoryDto>("/Category/create", createCategory, {
              headers: {
                "Content-Type": "application/json"
              }
            });
            setCategories((prev) => [...prev, res.data as ReturnCategory]);
            await getAll();
            await getAllMinimal();
            return res.data as ReturnCategory;
        }catch(err){
            console.error(err);
        }
        return null;
    }

    const addToCategory = async(id: string, transactionsIds: string[]): Promise<ReturnCategory | null> => {
        try{
            const res = await api.put<CategoryDto>(`/Category/add/${id}`, transactionsIds, {
              headers: {
                "Content-Type": "application/json"
              }
            });
            setCategories((prev) =>
                prev.map((c) =>
                  c.id === id ? { ...c, ...updateCategory } : c)
            );
            setMinCategories((prev) =>
                prev.map((c) =>
                  c.id === id ? { ...c, ...updateCategory } : c)
            );
            await getAll();
            await getAllMinimal();
            return res.data as ReturnCategory;
        }catch(err){
            console.error(err);
        }
        return null;
    }

    const removeOfCategory= async(id: string, transactionsIds: string[]): Promise<ReturnCategory| null> => {
        try{
            const res = await api.put<CategoryDto>(`/Category/remove/${id}`, transactionsIds, {
              headers: {
                "Content-Type": "application/json"
              }
            });
            setCategories((prev) =>
                prev.map((c) =>
                  c.id === id ? { ...c, ...updateCategory } : c)
            );
            setMinCategories((prev) =>
                prev.map((c) =>
                  c.id === id ? { ...c, ...updateCategory } : c)
            );
            await getAll();
            await getAllMinimal();
            return res.data as ReturnCategory;
        }catch(err){
            console.error(err);
        }
        return null;
    }

    const updateCategory = async(id:string, updateCategory: CategoryDto): Promise<ReturnCategory | null> => {
        try{
            const res = await api.put<CategoryDto>(`/Category/update/${id}`, updateCategory, {
              headers: {
                "Content-Type": "application/json"
              }
            });
            setCategories((prev) =>
                prev.map((c) =>
                  c.id === id ? { ...c, ...updateCategory } : c)
            );
            setMinCategories((prev) =>
                prev.map((c) =>
                  c.id === id ? { ...c, ...updateCategory } : c)
            );
            await getAll();
            await getAllMinimal();
            return res.data as ReturnCategory;
        }catch(err){
            console.error(err);
        }
        return null;
    }

    const deleteCategory = async(id: string) => {
        try{
            const res = await api.delete<CategoryDto>(`/Category/delete/${id}`);
            setCategories((prev) =>
                prev.filter((c) => c.id !== id)
            );
            setMinCategories((prev) =>
                prev.filter((c) => c.id !== id)
            );
            await getAll();
            await getAllMinimal();
            return res.data;
        }catch(err){
            console.error(err);
        }
        return null;
    }

    const categoryClearCache = () => {
        setMinCategories([]);
        setCategories([]);
    }

    useEffect(() => {
        let isMounted = true;

        const fetchData = async() => {
            if(isAuthenticated){
                const data = await getAll();
                const dataMin = await getAllMinimal();
                
                if(isMounted){
                  setCategories(data);
                  setMinCategories(dataMin);
                }
            }
        }

        fetchData();

        return() => {
            isMounted = false;
        }           
    }, [isAuthenticated])

    return(
        <CategoryContext.Provider value={{categories, setCategories, minCategories, setMinCategories, getAll, getAllMinimal, getById, createCategory,
                                         addToCategory, removeOfCategory ,updateCategory, deleteCategory, categoryClearCache}}>
            {children}
        </CategoryContext.Provider>
    )
}

export function useCategories(){
    const context = useContext(CategoryContext);
    if (!context) throw new Error("useCategories must be inside a provider");
    return context;
}