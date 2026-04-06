/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { MinimalTransaction, ReturnTransaction, TransactionDto, UpdateTransactionDto } from "../models/Transaction"
import api, { getAuthHeader } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { analytics } from "../analytics/analytics";

type TransctionContextType = {
    transactions: ReturnTransaction[];
    setTransactions: (t: ReturnTransaction[]) => void;
    minTrasactions: MinimalTransaction[];
    setMinTrasactions: (m: MinimalTransaction[]) => void;
    getAll: () => Promise<ReturnTransaction[]>;
    getAllMinimal: () => Promise<MinimalTransaction[]>;
    getById: (id: string) => Promise<ReturnTransaction>;
    createTransaction: (createTransaction: TransactionDto) => Promise<ReturnTransaction | null>;
    updateTransaction: (id: string, updateTransaction: UpdateTransactionDto) => Promise<ReturnTransaction | null>
    deleteTransaction: (id: string) => void;
    transactionClearCache: () => void;
    balance: number;
    income: number;
    expense: number;
}

const TransactionContext = createContext<TransctionContextType | null>(null);

export function TransactionProvider({children}:{children: React.ReactNode}){
    const [transactions, setTransactions] = useState<ReturnTransaction[]>([]);
    const [minTrasactions, setMinTrasactions] = useState<MinimalTransaction[]>([]);

    const { isAuthenticated } = useAuth();

    const getAll = async() => {
        try{
            const res = await api.get("/Transaction", {headers: getAuthHeader()});
            return res.data
        }catch(err){
            analytics.apiError("Get All Transactions: " + (err as Error).message);
            console.error(err)
        }
    }

    const getAllMinimal = async() => {
        try{
            const res = await api.get("/Transaction/minimal", {headers: getAuthHeader()});
            return res.data
        }catch(err){
            analytics.apiError("Get All Minimal Transactions: " + (err as Error).message);
            console.error(err)
        }
    }

    const getById = async(id:string) => {
        try{
            const res = await api.get(`/Transaction/${id}`, {headers: getAuthHeader()});
            return res.data
        }catch(err){
            analytics.apiError("Get Transaction By Id: " + (err as Error).message);
            console.error(err)
        }
    }

    const createTransaction = async(createTransaction: TransactionDto): Promise<ReturnTransaction | null> => {
        try{
            const res = await api.post<TransactionDto>("/Transaction/create", createTransaction, {
              headers: {
                "Content-Type": "application/json"
              }
            });
            setTransactions((prev) => [...prev, res.data as ReturnTransaction]);
            setMinTrasactions((prev) => [...prev, res.data as ReturnTransaction]);
            await getAll();
            await getAllMinimal();
            analytics.createTransaction();
            return res.data as ReturnTransaction;
        }catch(err){
            analytics.apiError("Create Transaction: " + (err as Error).message);
            console.error(err);
        }
        return null;
    }

    const updateTransaction = async(id:string, updateTransaction: UpdateTransactionDto): Promise<ReturnTransaction | null> => {
        try{
            const res = await api.put<UpdateTransactionDto>(`/Transaction/update/${id}`, updateTransaction, {
              headers: {
                "Content-Type": "application/json"
              }
            });
            setTransactions((prev) =>
                prev.map((t) =>
                  t.id === id ? { ...t, ...updateTransaction } : t)
            );
            setMinTrasactions((prev) =>
                prev.map((t) =>
                  t.id === id ? { ...t, ...updateTransaction } : t)
            );
            await getAll();
            await getAllMinimal();
            return res.data as ReturnTransaction;
        }catch(err){
            analytics.apiError("Update Transaction: " + (err as Error).message);
            console.error(err);
        }
        return null;
    }

    const deleteTransaction = async(id: string) => {
        try{
            const res = await api.delete<TransactionDto>(`/Transaction/delete/${id}`);
            setTransactions((prev) =>
                prev.filter((t) => t.id !== id)
            );
            setMinTrasactions((prev) =>
                prev.filter((t) => t.id !== id)
            );
            await getAll();
            await getAllMinimal();
            analytics.deleteTransaction();
            return res.data;
        }catch(err){
            analytics.apiError("Delete Transaction: " + (err as Error).message);
            console.error(err);
        }
        return null;
    }

    const balance = useMemo(() => {
        return transactions.reduce((acc, t) => {
          return t.transactionType === 0
            ? acc + t.amount
            : acc - t.amount;
        }, 0);
    }, [transactions]);

    const income = useMemo(() => {
        return transactions.reduce((acc, t) => {
          return t.transactionType === 0
            ? acc + t.amount
            : acc - 0;
        }, 0);
    }, [transactions]);

    const expense = useMemo(() => {
        return transactions.reduce((acc, t) => {
          return t.transactionType === 0
            ? acc + 0
            : acc - (t.amount * -1);
        }, 0);
    }, [transactions]);

    const transactionClearCache = () => {
        setMinTrasactions([]);
        setTransactions([]);
    }

    useEffect(() => {
        let isMounted = true;

        const fetchData = async() => {
            if(isAuthenticated){
                const data = await getAll();
                const dataMin = await getAllMinimal();
                
                if(isMounted){
                  setTransactions(data);
                  setMinTrasactions(dataMin);
                }
            }
        }

        fetchData();

        return() => {
            isMounted = false;
        }           
    }, [isAuthenticated])

    return(
        <TransactionContext.Provider value={{transactions, setTransactions, minTrasactions,
                                             setMinTrasactions, getAll, getAllMinimal, getById,
                                             createTransaction, updateTransaction, deleteTransaction,
                                             transactionClearCache, balance, income, expense}}>
            {children}
        </TransactionContext.Provider>
    )
}

export function useTransactions(){
    const context = useContext(TransactionContext);
    if (!context) throw new Error("useTransactions must be inside a provider");
    return context;
}